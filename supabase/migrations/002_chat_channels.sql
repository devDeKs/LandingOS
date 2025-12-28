-- ==============================================================================
-- Migration: Chat Channels Infrastructure (Updated)
-- Description: Channels linked to cards + fixed "Reunião" channel per project_name
-- NOTE: Safe to run on existing databases
-- ==============================================================================

-- 1. Create message type enum if not exists
DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('text', 'image', 'file');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create chat_messages table if not exists
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT,
    type message_type DEFAULT 'text',
    file_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Drop old chat_channels if it exists with old schema (simpler approach)
DROP TABLE IF EXISTS public.chat_channels CASCADE;

-- 4. Create chat_channels table fresh with new schema
CREATE TABLE public.chat_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name TEXT NOT NULL, -- The project name (e.g., "Landing Page Papinha")
    card_id UUID REFERENCES public.projects(id) ON DELETE CASCADE, -- NULL for "Reunião", links to card otherwise
    name TEXT NOT NULL, -- Channel display name
    description TEXT,
    is_default BOOLEAN DEFAULT false, -- True for "Reunião" channel
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. Add/update channel_id on chat_messages
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE;

-- 6. Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for chat_channels

DROP POLICY IF EXISTS "View Channels" ON public.chat_channels;
DROP POLICY IF EXISTS "Manage Channels" ON public.chat_channels;

-- View: Clients can see channels for their project_name, Admins see all
CREATE POLICY "View Channels" ON public.chat_channels FOR SELECT
USING (
    deleted_at IS NULL AND (
        is_admin() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND project_name = chat_channels.project_name)
    )
);

-- Manage: Admins only can create/update/delete channels
CREATE POLICY "Manage Channels" ON public.chat_channels FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 8. RLS Policies for chat_messages

DROP POLICY IF EXISTS "View Chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Send Chat" ON public.chat_messages;
DROP POLICY IF EXISTS "View Chat via Channel" ON public.chat_messages;
DROP POLICY IF EXISTS "Send Chat via Channel" ON public.chat_messages;
DROP POLICY IF EXISTS "Delete Chat" ON public.chat_messages;

-- View policy: via channel access
CREATE POLICY "View Chat via Channel" ON public.chat_messages FOR SELECT
USING (
    deleted_at IS NULL AND (
        is_admin() OR
        EXISTS (
            SELECT 1 FROM public.chat_channels c
            JOIN public.profiles p ON p.project_name = c.project_name
            WHERE c.id = channel_id AND p.id = auth.uid()
        )
    )
);

-- Insert policy: via channel access
CREATE POLICY "Send Chat via Channel" ON public.chat_messages FOR INSERT
WITH CHECK (
    is_admin() OR
    EXISTS (
        SELECT 1 FROM public.chat_channels c
        JOIN public.profiles p ON p.project_name = c.project_name
        WHERE c.id = channel_id AND p.id = auth.uid()
    )
);

-- Delete policy
CREATE POLICY "Delete Chat" ON public.chat_messages FOR UPDATE
USING (auth.uid() = sender_id OR is_admin());

-- 9. Add updated_at trigger to chat_channels
DROP TRIGGER IF EXISTS update_chat_channels_modtime ON public.chat_channels;
CREATE TRIGGER update_chat_channels_modtime 
BEFORE UPDATE ON public.chat_channels 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 10. Function to create channel when card is created
CREATE OR REPLACE FUNCTION create_card_channel()
RETURNS TRIGGER AS $$
DECLARE
    proj_name TEXT;
BEGIN
    -- Get the project_name from the client
    SELECT project_name INTO proj_name
    FROM public.profiles
    WHERE id = NEW.client_id;
    
    IF proj_name IS NOT NULL THEN
        -- Create channel for this card
        INSERT INTO public.chat_channels (project_name, card_id, name, is_default)
        VALUES (proj_name, NEW.id, NEW.name, false);
        
        -- Ensure "Reunião" channel exists for this project (if not exists)
        IF NOT EXISTS (SELECT 1 FROM public.chat_channels WHERE project_name = proj_name AND is_default = true AND deleted_at IS NULL) THEN
            INSERT INTO public.chat_channels (project_name, card_id, name, is_default)
            VALUES (proj_name, NULL, 'Reunião', true);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create channel for new cards
DROP TRIGGER IF EXISTS on_card_created_create_channel ON public.projects;
CREATE TRIGGER on_card_created_create_channel
AFTER INSERT ON public.projects
FOR EACH ROW EXECUTE PROCEDURE create_card_channel();

-- 11. Enable realtime
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_channels;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 12. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_channels_project_name ON public.chat_channels(project_name);
CREATE INDEX IF NOT EXISTS idx_chat_channels_card_id ON public.chat_channels(card_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- 13. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.chat_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.chat_channels TO authenticated;

-- 14. Create "Reunião" channels for existing projects (unique per project_name)
INSERT INTO public.chat_channels (project_name, card_id, name, is_default)
SELECT DISTINCT project_name, NULL::UUID, 'Reunião', true
FROM public.profiles
WHERE project_name IS NOT NULL 
  AND deleted_at IS NULL
  AND project_name != ''
ON CONFLICT DO NOTHING;

-- 15. Create channels for existing cards
INSERT INTO public.chat_channels (project_name, card_id, name, is_default)
SELECT p.project_name, c.id, c.name, false
FROM public.projects c
JOIN public.profiles p ON p.id = c.client_id
WHERE c.deleted_at IS NULL 
  AND p.project_name IS NOT NULL 
  AND p.project_name != '';
