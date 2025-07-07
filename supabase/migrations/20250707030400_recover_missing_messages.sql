-- Message Recovery Migration
-- This recovers previous chat history that may have been "lost" due to table structure changes

-- 1. First, let's check what message data exists and where
-- This will help identify where the "missing" messages actually are

-- 2. Migrate existing community messages to club_messages if they exist
-- Since ClubTalk.tsx now expects club_messages but community messages were likely in messages table
INSERT INTO public.club_messages (id, user_id, content, created_at)
SELECT 
  gen_random_uuid(), -- New UUID since we can't reuse IDs across tables
  user_id,
  content,
  created_at
FROM public.messages 
WHERE NOT EXISTS (
  SELECT 1 FROM public.club_messages cm 
  WHERE cm.content = public.messages.content 
  AND cm.user_id = public.messages.user_id
  AND ABS(EXTRACT(EPOCH FROM (cm.created_at - public.messages.created_at))) < 1
)
ON CONFLICT DO NOTHING;

-- 3. Ensure all authenticated users are members of the default topic chat groups
-- This fixes the issue where users can't see group messages due to missing memberships
DO $$
DECLARE 
    main_chat_id UUID;
    outdoors_chat_id UUID;
    bouldering_chat_id UUID;
    user_record RECORD;
BEGIN
    -- Get group IDs for the default topic chats
    SELECT id INTO main_chat_id FROM public.groups WHERE name = 'Toronto Climbing Club Main Chat';
    SELECT id INTO outdoors_chat_id FROM public.groups WHERE name = 'Outdoors Chat';
    SELECT id INTO bouldering_chat_id FROM public.groups WHERE name = 'Bouldering';
    
    -- Add all existing users to the main chat groups if they're not already members
    FOR user_record IN 
        SELECT id FROM public.profiles 
    LOOP
        -- Add to main chat
        IF main_chat_id IS NOT NULL THEN
            INSERT INTO public.group_members (group_id, user_id) 
            VALUES (main_chat_id, user_record.id)
            ON CONFLICT (group_id, user_id) DO NOTHING;
        END IF;
        
        -- Add to outdoors chat
        IF outdoors_chat_id IS NOT NULL THEN
            INSERT INTO public.group_members (group_id, user_id) 
            VALUES (outdoors_chat_id, user_record.id)
            ON CONFLICT (group_id, user_id) DO NOTHING;
        END IF;
        
        -- Add to bouldering chat
        IF bouldering_chat_id IS NOT NULL THEN
            INSERT INTO public.group_members (group_id, user_id) 
            VALUES (bouldering_chat_id, user_record.id)
            ON CONFLICT (group_id, user_id) DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- 4. Create a unified message view for debugging/recovery purposes
CREATE OR REPLACE VIEW public.all_messages_unified AS
SELECT 
  'messages' as source_table,
  m.id,
  m.user_id,
  m.content,
  m.created_at,
  COALESCE(p.display_name, 'Unknown User') as display_name,
  p.avatar_url,
  NULL as group_id,
  NULL as event_id,
  'community' as chat_type
FROM public.messages m
LEFT JOIN public.profiles p ON p.id = m.user_id

UNION ALL

SELECT 
  'club_messages' as source_table,
  cm.id,
  cm.user_id,
  cm.content,
  cm.created_at,
  COALESCE(p.display_name, 'Unknown User') as display_name,
  p.avatar_url,
  NULL as group_id,
  NULL as event_id,
  'club' as chat_type
FROM public.club_messages cm
LEFT JOIN public.profiles p ON p.id = cm.user_id

UNION ALL

SELECT 
  'group_messages' as source_table,
  gm.id,
  gm.user_id,
  gm.content,
  gm.created_at,
  COALESCE(p.display_name, 'Unknown User') as display_name,
  p.avatar_url,
  gm.group_id,
  NULL as event_id,
  'group' as chat_type
FROM public.group_messages gm
LEFT JOIN public.profiles p ON p.id = gm.user_id

UNION ALL

SELECT 
  'event_messages' as source_table,
  em.id,
  em.user_id,
  em.content,
  em.created_at,
  COALESCE(p.display_name, 'Unknown User') as display_name,
  p.avatar_url,
  NULL as group_id,
  em.event_id,
  'event' as chat_type
FROM public.event_messages em
LEFT JOIN public.profiles p ON p.id = em.user_id

ORDER BY created_at DESC;

-- 5. Grant access to the unified view for debugging
GRANT SELECT ON public.all_messages_unified TO authenticated;

-- 6. Add a function to check message visibility for debugging
CREATE OR REPLACE FUNCTION public.debug_message_visibility(table_name TEXT, message_id UUID)
RETURNS TABLE (
  can_view BOOLEAN,
  reason TEXT,
  user_id UUID,
  is_admin BOOLEAN,
  membership_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE as can_view,
    'Debug function - checking visibility' as reason,
    auth.uid() as user_id,
    COALESCE(p.is_admin, FALSE) as is_admin,
    CASE 
      WHEN table_name = 'group_messages' THEN 
        CASE WHEN EXISTS(SELECT 1 FROM public.group_members gm, public.group_messages gm2 WHERE gm.group_id = gm2.group_id AND gm2.id = message_id AND gm.user_id = auth.uid()) 
          THEN 'member' 
          ELSE 'not_member' 
        END
      WHEN table_name = 'event_messages' THEN
        CASE WHEN EXISTS(SELECT 1 FROM public.event_participants ep, public.event_messages em WHERE ep.event_id = em.event_id AND em.id = message_id AND ep.user_id = auth.uid()) 
          THEN 'participant' 
          ELSE 'not_participant' 
        END
      ELSE 'public'
    END as membership_status
  FROM public.profiles p 
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a temporary admin-accessible view of all data for recovery
CREATE OR REPLACE VIEW public.admin_data_recovery AS
SELECT 
  'Total messages in messages table' as metric,
  COUNT(*)::TEXT as value
FROM public.messages

UNION ALL

SELECT 
  'Total messages in club_messages table' as metric,
  COUNT(*)::TEXT as value
FROM public.club_messages

UNION ALL

SELECT 
  'Total messages in group_messages table' as metric,
  COUNT(*)::TEXT as value
FROM public.group_messages

UNION ALL

SELECT 
  'Total messages in event_messages table' as metric,
  COUNT(*)::TEXT as value
FROM public.event_messages

UNION ALL

SELECT 
  'Total users in profiles table' as metric,
  COUNT(*)::TEXT as value
FROM public.profiles

UNION ALL

SELECT 
  'Total group memberships' as metric,
  COUNT(*)::TEXT as value
FROM public.group_members;

-- Grant admin access to recovery view
GRANT SELECT ON public.admin_data_recovery TO authenticated;