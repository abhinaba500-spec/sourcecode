import { createClient } from '@supabase/supabase-js';

// Use the provided credentials or fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jnpszzhfounhqtqdusya.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHN6emhmb3VuaHF0cWR1c3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTQwODgsImV4cCI6MjA4MDQzMDA4OH0.hRXlcAfq2OvJltZu_hdx3DuC-oVaLm7tzvpW876xFX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our Database
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'user';
  plan_tier: 'free' | 'pro' | 'enterprise';
  tokens_balance: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  path: string;
  content: string;
  language: string;
}
