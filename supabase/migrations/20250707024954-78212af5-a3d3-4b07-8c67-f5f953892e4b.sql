-- Migration 2: Fix RLS Policies for Message Recovery

-- Enhanced admin policies for all message tables
CREATE POLICY "Admins can delete any message"
  ON public.messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete any group message"
  ON public.group_messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete any event message"
  ON public.event_messages FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );