-- Migration 3: Performance Optimization for 100+ Users

-- Add performance indexes for high-concurrency chat
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON public.messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_messages_group_created ON public.group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_messages_event_created ON public.event_messages(event_id, created_at DESC);

-- Add partial indexes for recent data
CREATE INDEX IF NOT EXISTS idx_messages_recent ON public.messages(created_at DESC)
  WHERE created_at >= (now() - interval '30 days');
CREATE INDEX IF NOT EXISTS idx_group_messages_recent ON public.group_messages(group_id, created_at DESC)
  WHERE created_at >= (now() - interval '30 days');
CREATE INDEX IF NOT EXISTS idx_event_messages_recent ON public.event_messages(event_id, created_at DESC)
  WHERE created_at >= (now() - interval '30 days');