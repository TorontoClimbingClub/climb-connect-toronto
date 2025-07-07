-- Admin Override Policies for Message Recovery and Moderation
-- These policies allow administrators to recover and moderate chat content across all channels

-- 1. Enhanced admin policies for message deletion across all tables
CREATE POLICY "Admins can delete any message" 
  ON public.messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete any group message" 
  ON public.group_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete any event message" 
  ON public.event_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- 2. Admin visibility policies for message recovery
CREATE POLICY "Admins can view all messages regardless of membership" 
  ON public.group_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_messages.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all event messages regardless of participation" 
  ON public.event_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
    OR
    EXISTS (
      SELECT 1 FROM public.event_participants 
      WHERE event_id = public.event_messages.event_id 
      AND user_id = auth.uid()
    )
  );

-- 3. Create admin message recovery view for troubleshooting
CREATE OR REPLACE VIEW public.admin_message_recovery AS
SELECT 
  'messages' as table_name,
  m.id,
  m.user_id,
  m.content,
  m.created_at,
  p.display_name,
  p.avatar_url,
  NULL as group_id,
  NULL as event_id,
  'community' as chat_type
FROM public.messages m
LEFT JOIN public.profiles p ON p.id = m.user_id

UNION ALL

SELECT 
  'group_messages' as table_name,
  gm.id,
  gm.user_id,
  gm.content,
  gm.created_at,
  p.display_name,
  p.avatar_url,
  gm.group_id,
  NULL as event_id,
  'group' as chat_type
FROM public.group_messages gm
LEFT JOIN public.profiles p ON p.id = gm.user_id

UNION ALL

SELECT 
  'event_messages' as table_name,
  em.id,
  em.user_id,
  em.content,
  em.created_at,
  p.display_name,
  p.avatar_url,
  NULL as group_id,
  em.event_id,
  'event' as chat_type
FROM public.event_messages em
LEFT JOIN public.profiles p ON p.id = em.user_id

UNION ALL

SELECT 
  'club_messages' as table_name,
  cm.id,
  cm.user_id,
  cm.content,
  cm.created_at,
  p.display_name,
  p.avatar_url,
  NULL as group_id,
  NULL as event_id,
  'club' as chat_type
FROM public.club_messages cm
LEFT JOIN public.profiles p ON p.id = cm.user_id

ORDER BY created_at DESC;

-- 4. Admin-only access to recovery view
CREATE POLICY "Admin recovery view access" 
  ON public.admin_message_recovery FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- 5. Create audit log for admin actions
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_user_id UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit log
CREATE POLICY "Admins can view audit log" 
  ON public.admin_audit_log FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Only admins can insert audit log entries
CREATE POLICY "Admins can insert audit log entries" 
  ON public.admin_audit_log FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = admin_user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- 6. Create function to log admin message deletions
CREATE OR REPLACE FUNCTION log_admin_message_deletion()
RETURNS trigger AS $$
BEGIN
  -- Only log if deletion was performed by an admin
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ) THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      target_table,
      target_id,
      target_user_id
    ) VALUES (
      auth.uid(),
      'DELETE_MESSAGE',
      TG_TABLE_NAME,
      OLD.id,
      OLD.user_id
    );
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers for audit logging
CREATE TRIGGER audit_messages_delete
  AFTER DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_message_deletion();

CREATE TRIGGER audit_group_messages_delete
  AFTER DELETE ON public.group_messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_message_deletion();

CREATE TRIGGER audit_event_messages_delete
  AFTER DELETE ON public.event_messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_message_deletion();

CREATE TRIGGER audit_club_messages_delete
  AFTER DELETE ON public.club_messages
  FOR EACH ROW EXECUTE FUNCTION log_admin_message_deletion();

-- 8. Enable realtime for audit log
ALTER TABLE public.admin_audit_log REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_log;

-- 9. Create indexes for audit log performance
CREATE INDEX idx_admin_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_target ON public.admin_audit_log(target_table, target_id);