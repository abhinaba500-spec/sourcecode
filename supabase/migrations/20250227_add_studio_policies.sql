/*
  # Add RLS Policies for Gravity Studio & Enterprise Tables

  ## Query Description:
  This migration enables Row Level Security (RLS) and adds access policies for the Project Management and Audit Log tables.
  Without this, the Gravity Studio cannot save/load projects, and the Admin panel cannot view logs.

  ## Metadata:
  - Schema-Category: "Security"
  - Impact-Level: "High" (Enables data access)
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Tables: projects, project_files, audit_logs
  - Policies: CRUD for owners, Read-only for Admins (Audit Logs)

  ## Security Implications:
  - RLS Status: Enabled for all 3 tables
  - Policy Changes: Adds strict ownership checks
*/

-- 1. PROJECTS TABLE
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
USING (auth.uid() = user_id);

-- 2. PROJECT FILES TABLE
-- Files are accessible if the user owns the parent project
ALTER TABLE IF EXISTS project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage files of their own projects"
ON project_files FOR ALL
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

-- 3. AUDIT LOGS TABLE
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
USING (public.is_admin());

-- System can insert logs (if using service role) or Admins/Users can generate logs via triggers
-- For now, allowing authenticated users to insert logs (e.g. "User logged in")
CREATE POLICY "Users can create audit logs"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);
