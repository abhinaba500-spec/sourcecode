/*
  # Fix Infinite Recursion in RLS Policies
  
  ## Problem
  The previous RLS policies caused an infinite loop (Error 42P17) because checking the 'admin' role 
  required reading the 'profiles' table, which triggered the policy check again.

  ## Solution
  1. Create a `SECURITY DEFINER` function `is_admin()` that bypasses RLS to safely check roles.
  2. Drop existing recursive policies.
  3. Re-implement policies using the safe `is_admin()` function.

  ## Metadata
  - Schema-Category: "Security"
  - Impact-Level: "High" (Fixes critical crash)
  - Requires-Backup: false
  - Reversible: true
*/

-- 1. Create a secure function to check roles without triggering RLS
-- SECURITY DEFINER allows this to run with owner privileges, bypassing the recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Safely remove existing policies to clear the recursion
-- We use a DO block to drop all policies on 'profiles' to ensure a clean slate
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' LOOP
        EXECUTE format('DROP POLICY "%s" ON profiles', pol.policyname);
    END LOOP;
END $$;

-- 3. Re-enable RLS (just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create new, non-recursive policies

-- Public Read: Allow everyone to read basic profile info (needed for team views)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Self Update: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admin Full Access: Admins can do everything (uses the secure function)
CREATE POLICY "Admins can do everything" 
ON profiles FOR ALL 
USING (is_admin());

-- Insert: Allow users to insert their own profile on signup
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
