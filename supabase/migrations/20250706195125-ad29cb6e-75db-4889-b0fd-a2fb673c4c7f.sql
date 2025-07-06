-- Add last_read_at column to group_members table
ALTER TABLE public.group_members
ADD COLUMN last_read_at TIMESTAMP WITH TIME ZONE;