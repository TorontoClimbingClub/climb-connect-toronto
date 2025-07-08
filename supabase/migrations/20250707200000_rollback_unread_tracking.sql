-- Rollback Unified Unread Tracking System
-- This migration reverts all changes from 20250707190000_unified_unread_tracking.sql
-- to restore original chat functionality

-- 1. Drop the update function
DROP FUNCTION IF EXISTS update_chat_read_status(UUID, TEXT, TEXT);

-- 2. Drop indexes on chat_read_status
DROP INDEX IF EXISTS idx_chat_read_status_updated_at;
DROP INDEX IF EXISTS idx_chat_read_status_user_chat;

-- 3. Drop chat_read_status table completely
DROP TABLE IF EXISTS chat_read_status;

-- 4. Remove last_read_at column from event_participants (if it was added)
-- Check if column exists first to avoid errors
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

-- Note: This rollback restores the original state where:
-- - Groups used group_members.last_read_at (original localStorage backup)
-- - Events had no unread tracking
-- - Club Talk had no unread tracking
-- - Community had no unread tracking