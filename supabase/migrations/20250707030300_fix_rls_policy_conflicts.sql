-- Emergency Fix: RLS Policy Conflicts Preventing Message Sending
-- This migration resolves policy conflicts and ensures message functionality

-- 1. Drop potentially conflicting policies first
DROP POLICY IF EXISTS "Admins can delete any message" ON public.messages;
DROP POLICY IF EXISTS "Admins can delete any group message" ON public.group_messages;
DROP POLICY IF EXISTS "Admins can delete any event message" ON public.event_messages;
DROP POLICY IF EXISTS "Admins can delete any club message" ON public.club_messages;
DROP POLICY IF EXISTS "Optimized message reads for high concurrency" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages regardless of membership" ON public.group_messages;
DROP POLICY IF EXISTS "Admins can view all event messages regardless of participation" ON public.event_messages;

-- 2. Ensure base policies exist for message sending (recreate if missing)
DROP POLICY IF EXISTS "Messages are viewable by authenticated users" ON public.messages;
CREATE POLICY "Messages are viewable by authenticated users" 
  ON public.messages FOR SELECT 
  TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
CREATE POLICY "Authenticated users can insert messages" 
  ON public.messages FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Fix group message policies
DROP POLICY IF EXISTS "Group messages viewable by group members" ON public.group_messages;
CREATE POLICY "Group messages viewable by group members" 
  ON public.group_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_messages.group_id 
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;
CREATE POLICY "Group members can send messages" 
  ON public.group_messages FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    (
      EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = public.group_messages.group_id 
        AND user_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND is_admin = true
      )
    )
  );

-- 4. Fix event message policies
DROP POLICY IF EXISTS "Event messages viewable by event participants" ON public.event_messages;
CREATE POLICY "Event messages viewable by event participants" 
  ON public.event_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.event_participants 
      WHERE event_id = public.event_messages.event_id 
      AND user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Event participants can send messages" ON public.event_messages;
CREATE POLICY "Event participants can send messages" 
  ON public.event_messages FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    (
      EXISTS (
        SELECT 1 FROM public.event_participants 
        WHERE event_id = public.event_messages.event_id 
        AND user_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND is_admin = true
      )
    )
  );

-- 5. Ensure club_messages policies are correct
DROP POLICY IF EXISTS "Club messages viewable by authenticated users" ON public.club_messages;
CREATE POLICY "Club messages viewable by authenticated users" 
  ON public.club_messages FOR SELECT 
  TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert club messages" ON public.club_messages;
CREATE POLICY "Authenticated users can insert club messages" 
  ON public.club_messages FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- 6. Add admin deletion policies (separate from view/insert policies)
CREATE POLICY "Admins can delete messages" 
  ON public.messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete group messages" 
  ON public.group_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete event messages" 
  ON public.event_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete club messages" 
  ON public.club_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- 7. Ensure all tables have proper RLS enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;

-- 8. Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT SELECT, INSERT ON public.group_messages TO authenticated;
GRANT SELECT, INSERT ON public.event_messages TO authenticated;
GRANT SELECT, INSERT ON public.club_messages TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.group_members TO authenticated;
GRANT SELECT ON public.event_participants TO authenticated;

-- 9. Test data - ensure at least one user exists in profiles for testing
-- This helps identify if the issue is missing user data
DO $$
BEGIN
  -- Check if current user has a profile
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  ) THEN
    -- Create a test profile if none exists (this should normally be handled by trigger)
    INSERT INTO public.profiles (id, display_name) 
    VALUES (auth.uid(), 'Test User')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;