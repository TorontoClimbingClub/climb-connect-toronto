-- Message Versioning and Comprehensive Audit Logging
-- Implements industry-standard edit history and audit trails

-- =====================================================
-- PHASE 1: Message Versioning System
-- =====================================================
-- Track complete edit history like Slack/Discord

-- Create message versions table for all message types
CREATE TABLE public.message_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL,
  table_name TEXT NOT NULL CHECK (table_name IN ('messages', 'group_messages', 'event_messages', 'club_messages')),
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE NOT NULL,
  edit_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient version lookups
CREATE INDEX idx_message_versions_lookup ON public.message_versions(table_name, message_id, version_number DESC);
CREATE INDEX idx_message_versions_edited_at ON public.message_versions(edited_at DESC);
CREATE INDEX idx_message_versions_edited_by ON public.message_versions(edited_by);

-- Enable RLS
ALTER TABLE public.message_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view versions of messages they can see
CREATE POLICY "View message versions based on message access" 
  ON public.message_versions FOR SELECT 
  TO authenticated 
  USING (
    CASE table_name
      -- For main/club messages: all authenticated users can view
      WHEN 'messages' THEN true
      WHEN 'club_messages' THEN true
      -- For group messages: only group members
      WHEN 'group_messages' THEN EXISTS (
        SELECT 1 FROM public.group_messages gm
        JOIN public.group_members gmem ON gmem.group_id = gm.group_id
        WHERE gm.id = message_versions.message_id 
        AND gmem.user_id = auth.uid()
      )
      -- For event messages: only participants
      WHEN 'event_messages' THEN EXISTS (
        SELECT 1 FROM public.event_messages em
        JOIN public.event_participants ep ON ep.event_id = em.event_id
        WHERE em.id = message_versions.message_id 
        AND ep.user_id = auth.uid()
      )
      ELSE false
    END
  );

-- Function to save message version before edit
CREATE OR REPLACE FUNCTION save_message_version()
RETURNS TRIGGER AS $$
DECLARE
  v_version_number INTEGER;
  v_table_name TEXT;
BEGIN
  -- Only save version if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    -- Determine table name from trigger
    v_table_name := TG_TABLE_NAME;
    
    -- Get next version number
    SELECT COALESCE(MAX(version_number), 0) + 1 
    INTO v_version_number
    FROM public.message_versions 
    WHERE message_id = OLD.id 
    AND table_name = v_table_name;
    
    -- Insert version record
    INSERT INTO public.message_versions (
      message_id,
      table_name,
      version_number,
      content,
      edited_by,
      edited_at
    ) VALUES (
      OLD.id,
      v_table_name,
      v_version_number,
      OLD.content,
      auth.uid(),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all message tables
CREATE TRIGGER save_messages_version 
  BEFORE UPDATE OF content ON public.messages
  FOR EACH ROW EXECUTE FUNCTION save_message_version();

CREATE TRIGGER save_group_messages_version 
  BEFORE UPDATE OF content ON public.group_messages
  FOR EACH ROW EXECUTE FUNCTION save_message_version();

CREATE TRIGGER save_event_messages_version 
  BEFORE UPDATE OF content ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION save_message_version();

CREATE TRIGGER save_club_messages_version 
  BEFORE UPDATE OF content ON public.club_messages
  FOR EACH ROW EXECUTE FUNCTION save_message_version();

-- =====================================================
-- PHASE 2: Comprehensive Audit Logging
-- =====================================================
-- Track all CRUD operations for compliance and debugging

-- Create audit log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- What happened
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE')),
  table_name TEXT NOT NULL,
  record_id UUID,
  -- Who did it
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_ip INET,
  user_agent TEXT,
  -- When it happened
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- What changed
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  -- Additional context
  context JSONB
);

-- Create indexes for audit queries
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_table_record ON public.audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);

-- Enable RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
  ON public.audit_log FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_user_id UUID;
  v_action TEXT;
  v_changed_fields TEXT[];
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Determine action
  IF TG_OP = 'INSERT' THEN
    v_action := 'INSERT';
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
    
    -- Check if this is a soft delete or restore
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      v_action := 'SOFT_DELETE';
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      v_action := 'RESTORE';
    ELSE
      v_action := 'UPDATE';
      -- Calculate changed fields
      SELECT array_agg(key) INTO v_changed_fields
      FROM jsonb_each_text(v_old_data)
      WHERE value IS DISTINCT FROM v_new_data->key;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'DELETE';
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
  END IF;
  
  -- Insert audit log entry
  INSERT INTO public.audit_log (
    action,
    table_name,
    record_id,
    user_id,
    old_data,
    new_data,
    changed_fields,
    context
  ) VALUES (
    v_action,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_user_id,
    v_old_data,
    v_new_data,
    v_changed_fields,
    jsonb_build_object(
      'client_ip', current_setting('request.headers')::json->>'cf-connecting-ip',
      'user_agent', current_setting('request.headers')::json->>'user-agent'
    )
  );
  
  -- Return appropriate value
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for all message tables
CREATE TRIGGER audit_messages 
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_group_messages 
  AFTER INSERT OR UPDATE OR DELETE ON public.group_messages
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_event_messages 
  AFTER INSERT OR UPDATE OR DELETE ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_club_messages 
  AFTER INSERT OR UPDATE OR DELETE ON public.club_messages
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Also audit critical tables
CREATE TRIGGER audit_profiles 
  AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_groups 
  AFTER INSERT OR UPDATE OR DELETE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_events 
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =====================================================
-- PHASE 3: Message Edit Tracking
-- =====================================================
-- Add edit tracking to all message tables

-- Add edit tracking columns if they don't exist
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.group_messages 
  ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.event_messages 
  ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.club_messages 
  ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Function to update edit tracking
CREATE OR REPLACE FUNCTION update_edit_tracking()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    NEW.edit_count := COALESCE(OLD.edit_count, 0) + 1;
    NEW.last_edited_at := now();
    NEW.last_edited_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for edit tracking
CREATE TRIGGER update_messages_edit_tracking 
  BEFORE UPDATE OF content ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_edit_tracking();

CREATE TRIGGER update_group_messages_edit_tracking 
  BEFORE UPDATE OF content ON public.group_messages
  FOR EACH ROW EXECUTE FUNCTION update_edit_tracking();

CREATE TRIGGER update_event_messages_edit_tracking 
  BEFORE UPDATE OF content ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION update_edit_tracking();

CREATE TRIGGER update_club_messages_edit_tracking 
  BEFORE UPDATE OF content ON public.club_messages
  FOR EACH ROW EXECUTE FUNCTION update_edit_tracking();

-- =====================================================
-- PHASE 4: Recovery Helper Functions
-- =====================================================

-- Function to get complete message history including edits
CREATE OR REPLACE FUNCTION get_message_history(
  p_table_name TEXT,
  p_message_id UUID
) RETURNS TABLE (
  version INTEGER,
  content TEXT,
  edited_by_name TEXT,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_current BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  -- Get all historical versions
  SELECT 
    mv.version_number,
    mv.content,
    p.display_name,
    mv.edited_at,
    FALSE as is_current
  FROM public.message_versions mv
  LEFT JOIN public.profiles p ON p.id = mv.edited_by
  WHERE mv.table_name = p_table_name 
  AND mv.message_id = p_message_id
  
  UNION ALL
  
  -- Get current version
  EXECUTE format(
    'SELECT 
      (SELECT COALESCE(MAX(version_number), 0) + 1 FROM public.message_versions WHERE table_name = %L AND message_id = %L),
      content,
      (SELECT display_name FROM public.profiles WHERE id = last_edited_by),
      last_edited_at,
      TRUE as is_current
    FROM public.%I 
    WHERE id = %L',
    p_table_name, p_message_id, p_table_name, p_message_id
  )
  
  ORDER BY version DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rollback message to specific version
CREATE OR REPLACE FUNCTION rollback_message_to_version(
  p_table_name TEXT,
  p_message_id UUID,
  p_version_number INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_content TEXT;
  v_success BOOLEAN := FALSE;
BEGIN
  -- Get content from specified version
  SELECT content INTO v_content
  FROM public.message_versions
  WHERE table_name = p_table_name
  AND message_id = p_message_id
  AND version_number = p_version_number;
  
  IF v_content IS NOT NULL THEN
    -- Update message with historical content
    EXECUTE format(
      'UPDATE public.%I SET content = %L WHERE id = %L',
      p_table_name, v_content, p_message_id
    );
    v_success := TRUE;
  END IF;
  
  RETURN v_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PHASE 5: Audit Search Functions
-- =====================================================

-- Function to search audit logs
CREATE OR REPLACE FUNCTION search_audit_logs(
  p_table_name TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_action TEXT DEFAULT NULL,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_limit INTEGER DEFAULT 100
) RETURNS SETOF public.audit_log AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.audit_log
  WHERE 
    (p_table_name IS NULL OR table_name = p_table_name)
    AND (p_user_id IS NULL OR user_id = p_user_id)
    AND (p_action IS NULL OR action = p_action)
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date)
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PHASE 6: Admin Dashboard Views
-- =====================================================

-- View for message edit statistics
CREATE OR REPLACE VIEW public.message_edit_stats AS
WITH edit_counts AS (
  SELECT 'messages' as table_name, COUNT(*) FILTER (WHERE edit_count > 0) as edited_messages, 
         AVG(edit_count) FILTER (WHERE edit_count > 0) as avg_edits FROM public.messages
  UNION ALL
  SELECT 'group_messages', COUNT(*) FILTER (WHERE edit_count > 0), 
         AVG(edit_count) FILTER (WHERE edit_count > 0) FROM public.group_messages
  UNION ALL
  SELECT 'event_messages', COUNT(*) FILTER (WHERE edit_count > 0), 
         AVG(edit_count) FILTER (WHERE edit_count > 0) FROM public.event_messages
  UNION ALL
  SELECT 'club_messages', COUNT(*) FILTER (WHERE edit_count > 0), 
         AVG(edit_count) FILTER (WHERE edit_count > 0) FROM public.club_messages
)
SELECT 
  table_name,
  edited_messages,
  ROUND(avg_edits, 2) as avg_edits_per_message
FROM edit_counts;

-- View for recent audit activity
CREATE OR REPLACE VIEW public.recent_audit_activity AS
SELECT 
  al.id,
  al.action,
  al.table_name,
  al.created_at,
  p.display_name as user_name,
  CASE 
    WHEN al.action = 'SOFT_DELETE' THEN al.old_data->>'content'
    WHEN al.action = 'UPDATE' THEN 'Edited: ' || array_to_string(al.changed_fields, ', ')
    WHEN al.action = 'INSERT' THEN 'New ' || al.table_name || ' created'
    WHEN al.action = 'RESTORE' THEN 'Restored deleted content'
    ELSE al.action
  END as description
FROM public.audit_log al
LEFT JOIN public.profiles p ON p.id = al.user_id
WHERE al.created_at >= (now() - interval '24 hours')
ORDER BY al.created_at DESC
LIMIT 100;

-- Grant access to admin views
GRANT SELECT ON public.message_edit_stats TO authenticated;
GRANT SELECT ON public.recent_audit_activity TO authenticated;

-- Add RLS policies for admin views
CREATE POLICY "Only admins can view edit stats" 
  ON public.message_edit_stats FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can view recent audit activity" 
  ON public.recent_audit_activity FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Final comment
COMMENT ON SCHEMA public IS 'Message versioning and audit logging complete - full edit history and compliance tracking enabled';