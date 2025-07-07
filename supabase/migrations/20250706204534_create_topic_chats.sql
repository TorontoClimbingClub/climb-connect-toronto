-- Create the three topic chat groups
INSERT INTO groups (name, description, created_by) VALUES 
(
  'Toronto Climbing Club Main Chat',
  'General discussion about climbing in Toronto, meetups, and community updates',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Outdoors Chat', 
  'Discuss outdoor climbing spots, routes, conditions, and outdoor adventures',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Bouldering',
  'Everything about bouldering - problems, techniques, and indoor bouldering gyms', 
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (name) DO NOTHING;

-- Get the group IDs that were just created or already exist
DO $$
DECLARE 
    main_chat_id UUID;
    outdoors_chat_id UUID;
    bouldering_chat_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get the first admin user (or any user) as the creator
    SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
    
    -- Get group IDs
    SELECT id INTO main_chat_id FROM groups WHERE name = 'Toronto Climbing Club Main Chat';
    SELECT id INTO outdoors_chat_id FROM groups WHERE name = 'Outdoors Chat';
    SELECT id INTO bouldering_chat_id FROM groups WHERE name = 'Bouldering';
    
    -- Add the creator as a member of each group
    INSERT INTO group_members (group_id, user_id) VALUES 
    (main_chat_id, admin_user_id),
    (outdoors_chat_id, admin_user_id),
    (bouldering_chat_id, admin_user_id)
    ON CONFLICT (group_id, user_id) DO NOTHING;
    
    -- Add welcome messages to each group
    INSERT INTO group_messages (group_id, user_id, content) VALUES
    (main_chat_id, admin_user_id, '<Ô Welcome to the Toronto Climbing Club Main Chat! This is your space to discuss all things climbing in Toronto. Share meetups, news, and connect with fellow climbers!'),
    (outdoors_chat_id, admin_user_id, '<2 Welcome to Outdoors Chat! Share outdoor climbing spots, route conditions, weather updates, and plan outdoor adventures with the community.'),
    (bouldering_chat_id, admin_user_id, '¡ Welcome to the Bouldering chat! Discuss boulder problems, techniques, gym recommendations, and everything bouldering-related.')
    ON CONFLICT DO NOTHING;
    
END $$;