-- Create groups table for climbing gym groups
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group messages table for separate chat histories
CREATE TABLE public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group members table
CREATE TABLE public.group_members (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Groups are viewable by authenticated users" 
  ON public.groups FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create groups" 
  ON public.groups FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" 
  ON public.groups FOR UPDATE 
  TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for group messages
CREATE POLICY "Group messages viewable by group members" 
  ON public.group_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_messages.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages" 
  ON public.group_messages FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_messages.group_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for group members
CREATE POLICY "Group members are viewable by authenticated users" 
  ON public.group_members FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can join groups" 
  ON public.group_members FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
  ON public.group_members FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for group tables
ALTER TABLE public.groups REPLICA IDENTITY FULL;
ALTER TABLE public.group_messages REPLICA IDENTITY FULL;
ALTER TABLE public.group_members REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;

-- Insert initial climbing gym groups
INSERT INTO public.groups (name, description) VALUES
  ('Basecamp Climbing', 'Connect with climbers at Basecamp Climbing gym'),
  ('True North Climbing', 'Connect with climbers at True North Climbing gym'),
  ('Joe Rockheads', 'Connect with climbers at Joe Rockheads gym');