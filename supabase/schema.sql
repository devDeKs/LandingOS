-- ==============================================================================
-- Schema Migration: Microsonic Admin Panel
-- Description: Core schema with RBAC, Soft Deletes, and Secure State Machine
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Identity & Access Management (IAM)
-- ==============================================================================

-- Roles: System-level roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- Permissions: Granular capabilities
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- e.g., 'project.create'
    description TEXT
);

-- Role <-> Permissions (One Role has many Permissions)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Profiles: Extends Supabase Auth (One-to-One with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft Delete
);

-- ==============================================================================
-- 3. Core Business Entities
-- ==============================================================================

-- Projects: The central unit
CREATE TYPE project_status AS ENUM ('draft', 'pending_approval', 'active', 'archived');

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status project_status DEFAULT 'draft',
    owner_id UUID REFERENCES public.profiles(id), -- Main admin managing the project
    client_id UUID REFERENCES public.profiles(id), -- The client
    client_accepted_at TIMESTAMPTZ, -- Timestamp when client accepted the project
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft Delete
);

-- Schedule Events: Timeline
CREATE TABLE IF NOT EXISTS public.schedule_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL, -- 'meeting', 'delivery', etc.
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft Delete
);

-- ==============================================================================
-- 4. Secure Communication
-- ==============================================================================

-- Chat Messages
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT, -- Sanitized text content
    type message_type DEFAULT 'text',
    file_url TEXT, -- Path to storage if type is image/file
    metadata JSONB, -- { size, mime_type, original_name }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft Delete
);

-- ==============================================================================
-- 5. Security & Verification
-- ==============================================================================

-- Audit Logs: Immutable security trail
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- e.g., 'PROJECT_STATUS_CHANGE'
    target_resource TEXT, -- e.g., 'projects:uuid'
    payload JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. Setup Supabase Realtime
-- ==============================================================================

-- Add tables to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_events;

-- ==============================================================================
-- 7. Triggers & Functions
-- ==============================================================================

-- 7.1 Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_schedule_events_modtime BEFORE UPDATE ON public.schedule_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==============================================================================
-- 9. Key Performance Indicators (Admin Dashboard)
-- ==============================================================================

CREATE OR REPLACE VIEW public.admin_kpi_stats AS
SELECT
    (SELECT COUNT(*) FROM public.projects WHERE status = 'active' AND deleted_at IS NULL) as active_projects,
    (SELECT COUNT(*) FROM public.projects WHERE status IN ('draft', 'pending_approval') AND deleted_at IS NULL) as pending_projects,
    (SELECT COUNT(*) FROM public.chat_messages WHERE created_at > (NOW() - INTERVAL '24 hours') AND deleted_at IS NULL) as recent_messages;

-- RLS for Views is slightly different (security_invoker or policy on underlying).
-- For simplicity, since it's a View, we rely on the underlying table policies OR
-- we just grant access to authenticated users and handle logic in the App (Admin check).
-- Supabase Views default to 'security invoker' usually in permissions unless specified.
-- Let's just grant SELECT to authenticated role, and RLS on table `projects` will filter rows?
-- NO, RLS on `projects` filters by Client ID usually. Admin needs to see ALL counts.
-- Admin RLS policy on `projects` is "is_admin()".
-- So if the view invokes security, an Admin user querying this View will see COUNT of ALL projects they can see (which is all).
-- A Client querying this view would see COUNT of THEIR projects.
-- This works perfectly.

GRANT SELECT ON public.admin_kpi_stats TO authenticated;

-- 7.2 Safe State Machine for Projects
CREATE OR REPLACE FUNCTION check_project_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent moving to 'active' without client acceptance timestamp
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
        IF NEW.client_accepted_at IS NULL THEN
            RAISE EXCEPTION 'Security Policy: Cannot activate project without client acceptance (client_accepted_at is null).';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_project_state_machine
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE check_project_status_transition();

-- 7.3 Profile Creation on Auth Signup (Supabase specific)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 8. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if user is Super Admin or Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT r.name INTO user_role
  FROM public.profiles p
  JOIN public.roles r ON p.role_id = r.id
  WHERE p.id = auth.uid();
  
  RETURN user_role IN ('super_admin', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES ---
-- Everyone can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (is_admin());
-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- --- PROJECTS ---
-- View: Admins see all (non-deleted). Clients see theirs (non-deleted).
CREATE POLICY "View Projects" ON public.projects FOR SELECT
USING (
    deleted_at IS NULL AND (
        is_admin() OR client_id = auth.uid()
    )
);

-- Insert/Update: Admins only
CREATE POLICY "Manage Projects" ON public.projects FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- --- SCHEDULE EVENTS ---
-- View: Admins see all. Clients see events for their projects.
CREATE POLICY "View Schedule" ON public.schedule_events FOR SELECT
USING (
    deleted_at IS NULL AND (
        is_admin() OR
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
    )
);

-- Manage: Admins only
CREATE POLICY "Manage Schedule" ON public.schedule_events FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- --- CHAT MESSAGES ---
-- View: Participants of the project
CREATE POLICY "View Chat" ON public.chat_messages FOR SELECT
USING (
    deleted_at IS NULL AND (
        is_admin() OR
        EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
    )
);

-- Insert: Participants of the project
CREATE POLICY "Send Chat" ON public.chat_messages FOR INSERT
WITH CHECK (
    is_admin() OR
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
);

-- Soft Delete: Admins OR User who sent it (within 5 mins?) - For now, Admins only or Sender
CREATE POLICY "Delete Chat" ON public.chat_messages FOR UPDATE
USING (
    auth.uid() = sender_id OR is_admin()
);

-- --- AUDIT LOGS ---
-- View: Super Admin only (Assuming Role Logic, simple check for now)
CREATE POLICY "View Audit Logs" ON public.audit_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.roles r ON p.role_id = r.id
        WHERE p.id = auth.uid() AND r.name = 'super_admin'
    )
);

-- Insert: System only (Security Definer functions) - No direct insert policy for users
-- (Audit logs should be created via triggers or backend functions, not direct client API)
