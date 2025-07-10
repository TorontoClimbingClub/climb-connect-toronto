-- Create message reactions system for all chat types
-- This enables emoji reactions on messages across group_messages, event_messages, club_messages, and belay_group_messages

-- Create reactions table with polymorphic design
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('group', 'event', 'club', 'belay_group')),
  message_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one reaction per user per message per emoji
  UNIQUE(user_id, message_type, message_id, emoji)
);

-- Enable Row Level Security
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Message reactions viewable by authenticated users" 
  ON public.message_reactions FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can add their own reactions" 
  ON public.message_reactions FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions" 
  ON public.message_reactions FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);

-- Admin override policy for reaction moderation
CREATE POLICY "Admins can delete any reaction" 
  ON public.message_reactions FOR DELETE 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Enable realtime for message_reactions
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;

-- Create indexes for performance
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_message_reactions_message_type_id ON public.message_reactions(message_type, message_id);
CREATE INDEX idx_message_reactions_emoji ON public.message_reactions(emoji);
CREATE INDEX idx_message_reactions_created_at ON public.message_reactions(created_at);

-- Create composite index for unique constraint performance
CREATE INDEX idx_message_reactions_unique ON public.message_reactions(user_id, message_type, message_id, emoji);

-- Create function to get reaction counts for a message
CREATE OR REPLACE FUNCTION get_message_reaction_counts(
  p_message_type TEXT,
  p_message_id UUID
)
RETURNS TABLE(emoji TEXT, count BIGINT, user_has_reacted BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mr.emoji,
    COUNT(*) as count,
    BOOL_OR(mr.user_id = auth.uid()) as user_has_reacted
  FROM public.message_reactions mr
  WHERE mr.message_type = p_message_type 
    AND mr.message_id = p_message_id
  GROUP BY mr.emoji
  ORDER BY COUNT(*) DESC, mr.emoji;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle reaction (add if doesn't exist, remove if exists)
CREATE OR REPLACE FUNCTION toggle_message_reaction(
  p_message_type TEXT,
  p_message_id UUID,
  p_emoji TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  reaction_exists BOOLEAN;
BEGIN
  -- Check if reaction already exists
  SELECT EXISTS(
    SELECT 1 FROM public.message_reactions 
    WHERE user_id = auth.uid() 
      AND message_type = p_message_type 
      AND message_id = p_message_id 
      AND emoji = p_emoji
  ) INTO reaction_exists;
  
  IF reaction_exists THEN
    -- Remove reaction
    DELETE FROM public.message_reactions 
    WHERE user_id = auth.uid() 
      AND message_type = p_message_type 
      AND message_id = p_message_id 
      AND emoji = p_emoji;
    RETURN FALSE;
  ELSE
    -- Add reaction
    INSERT INTO public.message_reactions (user_id, message_type, message_id, emoji)
    VALUES (auth.uid(), p_message_type, p_message_id, p_emoji);
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.message_reactions TO authenticated;
GRANT EXECUTE ON FUNCTION get_message_reaction_counts TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_message_reaction TO authenticated;