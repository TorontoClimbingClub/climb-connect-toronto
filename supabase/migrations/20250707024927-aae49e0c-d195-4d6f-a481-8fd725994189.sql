-- Migration 1: Create Missing Club Messages Table

-- Create missing club_messages table for Club Talk functionality
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

-- Admin override policy for message moderation
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
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_messages;

-- Create indexes for performance
CREATE INDEX idx_club_messages_user_id ON public.club_messages(user_id);
CREATE INDEX idx_club_messages_created_at ON public.club_messages(created_at);