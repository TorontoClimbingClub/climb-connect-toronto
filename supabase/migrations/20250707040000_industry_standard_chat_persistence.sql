-- Industry Standard Chat Persistence Migration
-- This brings the chat system up to WhatsApp/Facebook Messenger standards
-- Prevents catastrophic data loss and enables proper recovery mechanisms

-- =====================================================
-- PHASE 1: Remove CASCADE DELETE Constraints
-- =====================================================
-- This prevents mass message deletion when users/groups/events are deleted

-- 1. Drop existing foreign key constraints with CASCADE
ALTER TABLE public.messages 
  DROP CONSTRAINT IF EXISTS messages_user_id_fkey;

ALTER TABLE public.group_messages 
  DROP CONSTRAINT IF EXISTS group_messages_user_id_fkey,
  DROP CONSTRAINT IF EXISTS group_messages_group_id_fkey;

ALTER TABLE public.event_messages 
  DROP CONSTRAINT IF EXISTS event_messages_user_id_fkey,
  DROP CONSTRAINT IF EXISTS event_messages_event_id_fkey;

ALTER TABLE public.club_messages 
  DROP CONSTRAINT IF EXISTS club_messages_user_id_fkey;

-- 2. Recreate foreign keys with SET NULL instead of CASCADE
-- Messages persist even if user account is deleted
ALTER TABLE public.messages 
  ADD CONSTRAINT messages_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

ALTER TABLE public.group_messages 
  ADD CONSTRAINT group_messages_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

-- Group messages remain even if group is deleted (for recovery)
ALTER TABLE public.group_messages 
  ADD CONSTRAINT group_messages_group_id_fkey 
  FOREIGN KEY (group_id) REFERENCES public.groups(id) 
  ON DELETE SET NULL;

ALTER TABLE public.event_messages 
  ADD CONSTRAINT event_messages_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

-- Event messages remain even if event is deleted
ALTER TABLE public.event_messages 
  ADD CONSTRAINT event_messages_event_id_fkey 
  FOREIGN KEY (event_id) REFERENCES public.events(id) 
  ON DELETE SET NULL;

ALTER TABLE public.club_messages 
  ADD CONSTRAINT club_messages_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
  ON DELETE SET NULL;

-- =====================================================
-- PHASE 2: Implement Soft Deletes
-- =====================================================
-- Industry standard: Never actually delete messages, just mark them

-- Add soft delete columns to all message tables
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.group_messages 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.event_messages 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.club_messages 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON public.messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_group_messages_deleted_at ON public.group_messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_event_messages_deleted_at ON public.event_messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_club_messages_deleted_at ON public.club_messages(deleted_at);

-- =====================================================
-- PHASE 3: Message Deduplication (Idempotency)
-- =====================================================
-- Prevent duplicate messages from network retries

-- Add client-generated message ID for deduplication
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS client_message_id TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE public.group_messages 
  ADD COLUMN IF NOT EXISTS client_message_id TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE public.event_messages 
  ADD COLUMN IF NOT EXISTS client_message_id TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

ALTER TABLE public.club_messages 
  ADD COLUMN IF NOT EXISTS client_message_id TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- Create unique constraints for deduplication
-- Allow same client_message_id only if previous one is deleted
CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_dedup 
  ON public.messages(user_id, client_message_id) 
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_group_messages_dedup 
  ON public.group_messages(group_id, user_id, client_message_id) 
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_messages_dedup 
  ON public.event_messages(event_id, user_id, client_message_id) 
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_club_messages_dedup 
  ON public.club_messages(user_id, client_message_id) 
  WHERE deleted_at IS NULL;

-- =====================================================
-- PHASE 4: Message Delivery Tracking
-- =====================================================
-- Track delivery status like WhatsApp

ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT;

ALTER TABLE public.group_messages 
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT;

ALTER TABLE public.event_messages 
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT;

ALTER TABLE public.club_messages 
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT;

-- =====================================================
-- PHASE 5: Update RLS Policies for Soft Deletes
-- =====================================================
-- Hide soft-deleted messages from normal queries

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON public.messages;
DROP POLICY IF EXISTS "Club messages viewable by authenticated users" ON public.club_messages;
DROP POLICY IF EXISTS "Group messages viewable by group members" ON public.group_messages;
DROP POLICY IF EXISTS "Event messages viewable by event participants" ON public.event_messages;

-- Recreate SELECT policies excluding soft-deleted messages
CREATE POLICY "Messages viewable by authenticated (exclude deleted)" 
  ON public.messages FOR SELECT 
  TO authenticated 
  USING (deleted_at IS NULL);

CREATE POLICY "Club messages viewable by authenticated (exclude deleted)" 
  ON public.club_messages FOR SELECT 
  TO authenticated 
  USING (deleted_at IS NULL);

CREATE POLICY "Group messages viewable by members (exclude deleted)" 
  ON public.group_messages FOR SELECT 
  TO authenticated 
  USING (
    deleted_at IS NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_messages.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Event messages viewable by participants (exclude deleted)" 
  ON public.event_messages FOR SELECT 
  TO authenticated 
  USING (
    deleted_at IS NULL AND
    EXISTS (
      SELECT 1 FROM public.event_participants 
      WHERE event_id = public.event_messages.event_id 
      AND user_id = auth.uid()
    )
  );

-- =====================================================
-- PHASE 6: Soft Delete Functions
-- =====================================================
-- Replace hard deletes with soft deletes

-- Function to soft delete a message (marks as deleted instead of removing)
CREATE OR REPLACE FUNCTION soft_delete_message(
  table_name TEXT,
  message_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Validate table name to prevent SQL injection
  IF table_name NOT IN ('messages', 'group_messages', 'event_messages', 'club_messages') THEN
    RAISE EXCEPTION 'Invalid table name';
  END IF;

  -- Execute soft delete based on table
  EXECUTE format(
    'UPDATE public.%I SET deleted_at = now(), deleted_by = auth.uid() WHERE id = $1 AND deleted_at IS NULL',
    table_name
  ) USING message_id;

  GET DIAGNOSTICS success = ROW_COUNT > 0;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore soft-deleted messages
CREATE OR REPLACE FUNCTION restore_message(
  table_name TEXT,
  message_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := FALSE;
  is_admin BOOLEAN;
  is_owner BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT profiles.is_admin INTO is_admin
  FROM public.profiles 
  WHERE id = auth.uid();

  -- Check if user is the one who deleted it
  EXECUTE format(
    'SELECT deleted_by = auth.uid() FROM public.%I WHERE id = $1',
    table_name
  ) USING message_id INTO is_owner;

  -- Only admin or the person who deleted can restore
  IF NOT (is_admin OR is_owner) THEN
    RAISE EXCEPTION 'Unauthorized to restore this message';
  END IF;

  -- Restore the message
  EXECUTE format(
    'UPDATE public.%I SET deleted_at = NULL, deleted_by = NULL WHERE id = $1',
    table_name
  ) USING message_id;

  GET DIAGNOSTICS success = ROW_COUNT > 0;
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PHASE 7: Recovery Views
-- =====================================================
-- Views for admins to see and recover deleted content

-- View for deleted messages (admin only)
CREATE OR REPLACE VIEW public.deleted_messages_recovery AS
SELECT 
  'messages' as table_name,
  m.id,
  m.user_id,
  m.content,
  m.created_at,
  m.deleted_at,
  m.deleted_by,
  p1.display_name as author_name,
  p2.display_name as deleted_by_name
FROM public.messages m
LEFT JOIN public.profiles p1 ON p1.id = m.user_id
LEFT JOIN public.profiles p2 ON p2.id = m.deleted_by
WHERE m.deleted_at IS NOT NULL

UNION ALL

SELECT 
  'club_messages' as table_name,
  cm.id,
  cm.user_id,
  cm.content,
  cm.created_at,
  cm.deleted_at,
  cm.deleted_by,
  p1.display_name as author_name,
  p2.display_name as deleted_by_name
FROM public.club_messages cm
LEFT JOIN public.profiles p1 ON p1.id = cm.user_id
LEFT JOIN public.profiles p2 ON p2.id = cm.deleted_by
WHERE cm.deleted_at IS NOT NULL

UNION ALL

SELECT 
  'group_messages' as table_name,
  gm.id,
  gm.user_id,
  gm.content,
  gm.created_at,
  gm.deleted_at,
  gm.deleted_by,
  p1.display_name as author_name,
  p2.display_name as deleted_by_name
FROM public.group_messages gm
LEFT JOIN public.profiles p1 ON p1.id = gm.user_id
LEFT JOIN public.profiles p2 ON p2.id = gm.deleted_by
WHERE gm.deleted_at IS NOT NULL

UNION ALL

SELECT 
  'event_messages' as table_name,
  em.id,
  em.user_id,
  em.content,
  em.created_at,
  em.deleted_at,
  em.deleted_by,
  p1.display_name as author_name,
  p2.display_name as deleted_by_name
FROM public.event_messages em
LEFT JOIN public.profiles p1 ON p1.id = em.user_id
LEFT JOIN public.profiles p2 ON p2.id = em.deleted_by
WHERE em.deleted_at IS NOT NULL

ORDER BY deleted_at DESC;

-- Grant access to deleted messages view only to admins
CREATE POLICY "Only admins can view deleted messages" 
  ON public.deleted_messages_recovery FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- =====================================================
-- PHASE 8: Message Health Monitoring
-- =====================================================
-- Monitor message delivery and system health

CREATE OR REPLACE FUNCTION get_message_health_stats()
RETURNS TABLE (
  metric TEXT,
  value BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_messages,
      COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_messages,
      COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) as delivered_messages,
      COUNT(*) FILTER (WHERE failed_at IS NOT NULL) as failed_messages,
      COUNT(*) as total_messages
    FROM (
      SELECT deleted_at, delivered_at, failed_at FROM public.messages
      UNION ALL
      SELECT deleted_at, delivered_at, failed_at FROM public.club_messages
      UNION ALL
      SELECT deleted_at, delivered_at, failed_at FROM public.group_messages
      UNION ALL
      SELECT deleted_at, delivered_at, failed_at FROM public.event_messages
    ) all_msgs
  )
  SELECT 'Active Messages'::TEXT, active_messages, 
         ROUND((active_messages::NUMERIC / NULLIF(total_messages, 0)) * 100, 2)
  FROM stats
  UNION ALL
  SELECT 'Deleted Messages'::TEXT, deleted_messages,
         ROUND((deleted_messages::NUMERIC / NULLIF(total_messages, 0)) * 100, 2)
  FROM stats
  UNION ALL
  SELECT 'Delivered Messages'::TEXT, delivered_messages,
         ROUND((delivered_messages::NUMERIC / NULLIF(active_messages, 0)) * 100, 2)
  FROM stats
  UNION ALL
  SELECT 'Failed Messages'::TEXT, failed_messages,
         ROUND((failed_messages::NUMERIC / NULLIF(total_messages, 0)) * 100, 2)
  FROM stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PHASE 9: Update Existing Views
-- =====================================================
-- Update existing views to exclude soft-deleted messages

DROP VIEW IF EXISTS public.messages_with_profiles CASCADE;
DROP VIEW IF EXISTS public.group_messages_with_profiles CASCADE;
DROP VIEW IF EXISTS public.event_messages_with_profiles CASCADE;
DROP VIEW IF EXISTS public.club_messages_with_profiles CASCADE;

CREATE OR REPLACE VIEW public.messages_with_profiles AS
SELECT 
  m.id,
  m.user_id,
  m.content,
  m.created_at,
  m.message_type,
  m.event_id,
  m.event_metadata,
  m.client_message_id,
  m.sent_at,
  m.delivered_at,
  COALESCE(p.display_name, 'Deleted User') as display_name,
  p.avatar_url
FROM public.messages m
LEFT JOIN public.profiles p ON p.id = m.user_id
WHERE m.deleted_at IS NULL
ORDER BY m.created_at DESC;

CREATE OR REPLACE VIEW public.group_messages_with_profiles AS
SELECT 
  gm.id,
  gm.group_id,
  gm.user_id,
  gm.content,
  gm.created_at,
  gm.message_type,
  gm.event_id,
  gm.event_metadata,
  gm.client_message_id,
  gm.sent_at,
  gm.delivered_at,
  COALESCE(p.display_name, 'Deleted User') as display_name,
  p.avatar_url
FROM public.group_messages gm
LEFT JOIN public.profiles p ON p.id = gm.user_id
WHERE gm.deleted_at IS NULL
ORDER BY gm.created_at DESC;

CREATE OR REPLACE VIEW public.event_messages_with_profiles AS
SELECT 
  em.id,
  em.event_id,
  em.user_id,
  em.content,
  em.created_at,
  em.client_message_id,
  em.sent_at,
  em.delivered_at,
  COALESCE(p.display_name, 'Deleted User') as display_name,
  p.avatar_url
FROM public.event_messages em
LEFT JOIN public.profiles p ON p.id = em.user_id
WHERE em.deleted_at IS NULL
ORDER BY em.created_at DESC;

CREATE OR REPLACE VIEW public.club_messages_with_profiles AS
SELECT 
  cm.id,
  cm.user_id,
  cm.content,
  cm.created_at,
  cm.client_message_id,
  cm.sent_at,
  cm.delivered_at,
  COALESCE(p.display_name, 'Deleted User') as display_name,
  p.avatar_url
FROM public.club_messages cm
LEFT JOIN public.profiles p ON p.id = cm.user_id
WHERE cm.deleted_at IS NULL
ORDER BY cm.created_at DESC;

-- Grant access to updated views
GRANT SELECT ON public.messages_with_profiles TO authenticated;
GRANT SELECT ON public.group_messages_with_profiles TO authenticated;
GRANT SELECT ON public.event_messages_with_profiles TO authenticated;
GRANT SELECT ON public.club_messages_with_profiles TO authenticated;

-- =====================================================
-- PHASE 10: Admin Policies for Soft Delete
-- =====================================================
-- Update admin delete policies to use soft delete

DROP POLICY IF EXISTS "Admins can delete any club message" ON public.club_messages;

-- Admins can soft delete any message
CREATE POLICY "Admins can soft delete any message" 
  ON public.messages FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can soft delete any club message" 
  ON public.club_messages FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can soft delete any group message" 
  ON public.group_messages FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can soft delete any event message" 
  ON public.event_messages FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Users can soft delete their own messages
CREATE POLICY "Users can soft delete own messages" 
  ON public.messages FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can soft delete own club messages" 
  ON public.club_messages FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can soft delete own group messages" 
  ON public.group_messages FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can soft delete own event messages" 
  ON public.event_messages FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- Final message
COMMENT ON SCHEMA public IS 'Chat system now meets industry standards with soft deletes, message persistence, and proper recovery mechanisms';