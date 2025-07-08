-- Unified Unread Message Tracking System
-- This migration adds comprehensive unread tracking across all chat types

-- 1. Add last_read_at to event_participants for event chat tracking
ALTER TABLE event_participants 
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE;

-- 2. Create a universal chat_read_status table for non-membership chats (Club Talk, Community)
CREATE TABLE IF NOT EXISTS chat_read_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chat_type TEXT NOT NULL, -- 'club_talk', 'community_topic', etc.
    chat_identifier TEXT NOT NULL, -- group_id, topic_name, 'club_talk'
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chat_type, chat_identifier)
);

-- 3. Enable RLS on chat_read_status
ALTER TABLE chat_read_status ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for chat_read_status
CREATE POLICY "Users can view their own read status" ON chat_read_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own read status" ON chat_read_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read status" ON chat_read_status
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_read_status_user_chat 
ON chat_read_status(user_id, chat_type, chat_identifier);

CREATE INDEX IF NOT EXISTS idx_chat_read_status_updated_at 
ON chat_read_status(updated_at);

-- 6. Create function to update read status (upsert functionality)
CREATE OR REPLACE FUNCTION update_chat_read_status(
    p_user_id UUID,
    p_chat_type TEXT,
    p_chat_identifier TEXT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO chat_read_status (user_id, chat_type, chat_identifier, last_read_at, updated_at)
    VALUES (p_user_id, p_chat_type, p_chat_identifier, NOW(), NOW())
    ON CONFLICT (user_id, chat_type, chat_identifier)
    DO UPDATE SET 
        last_read_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant necessary permissions
GRANT EXECUTE ON FUNCTION update_chat_read_status TO authenticated;