-- ============================================================
-- ROLLBACK SCRIPT: Remove Admin Panel, Chat & Approval Features
-- Execute this in Supabase SQL Editor
-- ============================================================

-- 1. Remove Realtime FIRST (before dropping tables)
DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.projects';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.chat_messages';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.schedule_events';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Drop Views
DROP VIEW IF EXISTS public.admin_kpi_stats CASCADE;
DROP VIEW IF EXISTS public.admin_project_stats CASCADE;

-- 3. Drop Triggers
DROP TRIGGER IF EXISTS enforce_project_state_machine ON public.projects;
DROP TRIGGER IF EXISTS validate_chat_message_trigger ON public.chat_messages;

-- 4. Drop Trigger Functions
DROP FUNCTION IF EXISTS public.check_project_status_transition() CASCADE;
DROP FUNCTION IF EXISTS public.validate_chat_message() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- 5. Drop RLS Policies (Chat & Admin)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "View Projects" ON public.projects;
DROP POLICY IF EXISTS "Manage Projects" ON public.projects;
DROP POLICY IF EXISTS "View Schedule" ON public.schedule_events;
DROP POLICY IF EXISTS "Manage Schedule" ON public.schedule_events;
DROP POLICY IF EXISTS "View Chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Send Chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Delete Chat" ON public.chat_messages;
DROP POLICY IF EXISTS "View Audit Logs" ON public.audit_logs;

-- 6. Drop Support Tables (Order matters due to FK)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;

-- 7. Drop ENUM Types
DROP TYPE IF EXISTS public.message_type CASCADE;

-- 8. Simplify Profiles (Remove role_id FK)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role_id;

-- ============================================================
-- DONE: Database is now simplified
-- ============================================================
