-- Enhanced Chat Features Migration
-- Adds support for message reactions, editing, typing indicators, and mentions

-- Add columns to messages table for editing support
ALTER TABLE public.messages 
ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN original_content TEXT,
ADD COLUMN mentioned_users UUID[];

-- Create message reactions table
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create typing indicators table (temporary real-time data)
CREATE TABLE public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  is_typing BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(room_name, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Message reactions viewable by authenticated users" 
  ON public.message_reactions FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can add reactions" 
  ON public.message_reactions FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions" 
  ON public.message_reactions FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for typing_indicators
CREATE POLICY "Typing indicators viewable by authenticated users" 
  ON public.typing_indicators FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can insert their own typing status" 
  ON public.typing_indicators FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own typing status" 
  ON public.typing_indicators FOR UPDATE 
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own typing status" 
  ON public.typing_indicators FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for message editing
CREATE POLICY "Users can update their own messages" 
  ON public.messages FOR UPDATE 
  TO authenticated USING (auth.uid() = user_id);

-- Function to clean up old typing indicators (older than 10 seconds)
CREATE OR REPLACE FUNCTION cleanup_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators 
  WHERE updated_at < (now() - interval '10 seconds');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to extract mentioned users from message content
CREATE OR REPLACE FUNCTION extract_mentions(content TEXT)
RETURNS UUID[] AS $$
DECLARE
  mentions TEXT[];
  mention_usernames TEXT[];
  mention_ids UUID[];
  i INTEGER;
BEGIN
  -- Extract @username patterns
  SELECT array_agg(substring(match[1]))
  INTO mention_usernames
  FROM regexp_split_to_table(content, '@(\w+)', 'g') AS match
  WHERE match IS NOT NULL AND match != '';
  
  IF mention_usernames IS NULL THEN
    RETURN ARRAY[]::UUID[];
  END IF;
  
  -- Convert usernames to user IDs
  SELECT array_agg(id)
  INTO mention_ids
  FROM public.profiles
  WHERE display_name = ANY(mention_usernames);
  
  RETURN COALESCE(mention_ids, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically extract mentions when inserting/updating messages
CREATE OR REPLACE FUNCTION handle_message_mentions()
RETURNS trigger AS $$
BEGIN
  NEW.mentioned_users := extract_mentions(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_mention_extraction
  BEFORE INSERT OR UPDATE ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE handle_message_mentions();

-- Enable realtime for new tables
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;

-- Create indexes for performance
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX idx_typing_indicators_room_name ON public.typing_indicators(room_name);
CREATE INDEX idx_typing_indicators_updated_at ON public.typing_indicators(updated_at);
CREATE INDEX idx_messages_mentioned_users ON public.messages USING GIN(mentioned_users);

-- Create a view for messages with reaction counts
CREATE VIEW public.messages_with_reactions AS
SELECT 
  m.*,
  COALESCE(
    json_agg(
      json_build_object(
        'emoji', mr.emoji,
        'count', reaction_counts.count,
        'users', reaction_counts.users
      )
    ) FILTER (WHERE mr.emoji IS NOT NULL),
    '[]'::json
  ) AS reactions
FROM public.messages m
LEFT JOIN (
  SELECT 
    message_id,
    emoji,
    COUNT(*) as count,
    array_agg(
      json_build_object(
        'id', mr.user_id,
        'username', p.display_name
      )
    ) as users
  FROM public.message_reactions mr
  JOIN public.profiles p ON p.id = mr.user_id
  GROUP BY message_id, emoji
) reaction_counts ON reaction_counts.message_id = m.id
LEFT JOIN public.message_reactions mr ON mr.message_id = m.id AND mr.emoji = reaction_counts.emoji
GROUP BY m.id, m.content, m.created_at, m.user_id, m.edited_at, m.original_content, m.mentioned_users
ORDER BY m.created_at;