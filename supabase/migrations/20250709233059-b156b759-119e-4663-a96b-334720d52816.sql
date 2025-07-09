-- Add approval status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_approved boolean DEFAULT false;

-- Update existing users to be approved (so current users can continue using the app)
UPDATE public.profiles 
SET is_approved = true 
WHERE is_admin = true;

-- Update RLS policies for chat messages to require approval

-- Update club_messages policy
DROP POLICY IF EXISTS "Authenticated users can insert club messages" ON public.club_messages;
CREATE POLICY "Approved users can insert club messages" 
ON public.club_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_approved = true
  )
);

-- Update group_messages policy
DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;
CREATE POLICY "Approved group members can send messages" 
ON public.group_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_approved = true
  ) AND 
  EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id = group_messages.group_id AND user_id = auth.uid()
  )
);

-- Update event_messages policy
DROP POLICY IF EXISTS "Event participants can send messages" ON public.event_messages;
CREATE POLICY "Approved event participants can send messages" 
ON public.event_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_approved = true
  ) AND 
  EXISTS (
    SELECT 1 FROM event_participants 
    WHERE event_id = event_messages.event_id AND user_id = auth.uid()
  )
);

-- Update belay_group_messages policy
DROP POLICY IF EXISTS "Participants can send messages" ON public.belay_group_messages;
CREATE POLICY "Approved participants can send messages" 
ON public.belay_group_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_approved = true
  ) AND 
  EXISTS (
    SELECT 1 FROM belay_group_participants 
    WHERE belay_group_id = belay_group_messages.belay_group_id AND user_id = auth.uid()
  )
);