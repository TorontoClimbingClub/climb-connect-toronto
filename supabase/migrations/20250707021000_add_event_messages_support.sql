-- Add support for event messages in chat
-- Add message_type and event_id columns to group_messages table

ALTER TABLE public.group_messages 
ADD COLUMN message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'event')),
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
ADD COLUMN event_metadata JSONB;

-- Also add the same support to regular messages table
ALTER TABLE public.messages 
ADD COLUMN message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'event')),
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
ADD COLUMN event_metadata JSONB;

-- Create index for performance on event messages
CREATE INDEX idx_group_messages_event_id ON public.group_messages(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_messages_event_id ON public.messages(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_group_messages_type ON public.group_messages(message_type);
CREATE INDEX idx_messages_type ON public.messages(message_type);