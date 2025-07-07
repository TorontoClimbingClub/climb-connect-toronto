-- Create missing club_messages table for Club Talk functionality
-- This fixes the critical issue where ClubTalk.tsx references a non-existent table

CREATE TABLE public.club_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for club_messages
CREATE POLICY "Club messages viewable by authenticated users" 
  ON public.club_messages FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert club messages" 
  ON public.club_messages FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admin override policy for message moderation and recovery
CREATE POLICY "Admins can delete any club message" 
  ON public.club_messages FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Enable realtime for club_messages
ALTER TABLE public.club_messages REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_messages;

-- Create indexes for performance with 100+ concurrent users
CREATE INDEX idx_club_messages_user_id ON public.club_messages(user_id);
CREATE INDEX idx_club_messages_created_at ON public.club_messages(created_at);
CREATE INDEX idx_club_messages_content_search ON public.club_messages USING gin(to_tsvector('english', content));

-- Add welcome message to club chat
INSERT INTO public.club_messages (user_id, content) 
SELECT 
  id,
  '🏔️ Welcome to Club Talk! This is the main discussion space for the Toronto Climbing Club. Share updates, ask questions, and connect with fellow climbers!'
FROM public.profiles 
WHERE is_admin = true 
LIMIT 1
ON CONFLICT DO NOTHING;