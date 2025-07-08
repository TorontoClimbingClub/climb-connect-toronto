-- Drop the problematic update function
DROP FUNCTION IF EXISTS update_chat_read_status(UUID, TEXT, TEXT);

-- Drop indexes on chat_read_status
DROP INDEX IF EXISTS idx_chat_read_status_updated_at;
DROP INDEX IF EXISTS idx_chat_read_status_user_chat;

-- Drop chat_read_status table completely (this is the main culprit)
DROP TABLE IF EXISTS chat_read_status;

-- Remove last_read_at column from event_participants if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'last_read_at'
    ) THEN
        ALTER TABLE event_participants DROP COLUMN last_read_at;
    END IF;
END $$;