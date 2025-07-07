-- Add last_read_at column to event_participants table for unread message tracking
ALTER TABLE public.event_participants ADD COLUMN last_read_at TIMESTAMP WITH TIME ZONE;