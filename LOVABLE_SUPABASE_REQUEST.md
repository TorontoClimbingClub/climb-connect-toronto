# Supabase Database Changes for Groups Feature

Please make the following database changes to add a groups feature with separate chat rooms:

## 1. Create Groups Table
Create a table called `groups` with these columns:
- `id` - UUID primary key with auto-generation
- `name` - Text, required, unique (for group name)
- `description` - Text, optional (for group description)
- `avatar_url` - Text, optional (for group avatar image)
- `created_by` - UUID foreign key to profiles table
- `created_at` - Timestamp with timezone, defaults to now()

## 2. Create Group Messages Table
Create a table called `group_messages` with these columns:
- `id` - UUID primary key with auto-generation
- `group_id` - UUID foreign key to groups table, cascade on delete
- `user_id` - UUID foreign key to profiles table, cascade on delete
- `content` - Text, required (message content)
- `created_at` - Timestamp with timezone, defaults to now()

## 3. Create Group Members Table
Create a table called `group_members` with these columns:
- `group_id` - UUID foreign key to groups table, cascade on delete
- `user_id` - UUID foreign key to profiles table, cascade on delete
- `joined_at` - Timestamp with timezone, defaults to now()
- Primary key should be composite of (group_id, user_id)

## 4. Enable Row Level Security
Enable RLS on all three new tables:
- groups
- group_messages
- group_members

## 5. Create RLS Policies

### For groups table:
- **Select**: Allow all authenticated users to view all groups
- **Insert**: Allow authenticated users to create groups (created_by must match their user id)
- **Update**: Allow only group creators to update their groups

### For group_messages table:
- **Select**: Allow only group members to view messages (user must exist in group_members for that group)
- **Insert**: Allow only group members to send messages (user must exist in group_members for that group AND user_id must match their id)

### For group_members table:
- **Select**: Allow all authenticated users to view group members
- **Insert**: Allow users to join groups (user_id must match their id)
- **Delete**: Allow users to leave groups (user_id must match their id)

## 6. Enable Realtime
Enable realtime for all three tables

## 7. Insert Initial Data
Insert these three climbing gym groups:
1. Name: "Basecamp Climbing", Description: "Connect with climbers at Basecamp Climbing gym"
2. Name: "True North Climbing", Description: "Connect with climbers at True North Climbing gym"
3. Name: "Joe Rockheads", Description: "Connect with climbers at Joe Rockheads gym"

These groups should be created without a created_by value (system-created).

## 8. Update TypeScript Types
After creating the tables, regenerate the TypeScript types to include the new tables.