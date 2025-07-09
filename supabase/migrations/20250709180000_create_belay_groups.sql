-- Create belay_groups table for partner finding feature
CREATE TABLE public.belay_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  climbing_type TEXT NOT NULL CHECK (climbing_type IN ('top_rope', 'lead', 'bouldering', 'mixed')),
  location TEXT NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  capacity INTEGER NOT NULL DEFAULT 2 CHECK (capacity >= 2 AND capacity <= 10),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'disabled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create belay_group_participants table for member tracking
CREATE TABLE public.belay_group_participants (
  belay_group_id UUID REFERENCES public.belay_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (belay_group_id, user_id)
);

-- Create belay_group_messages table for group chat
CREATE TABLE public.belay_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  belay_group_id UUID REFERENCES public.belay_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.belay_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belay_group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belay_group_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for belay_groups
CREATE POLICY "Public belay groups viewable by all authenticated users" 
  ON public.belay_groups FOR SELECT 
  TO authenticated USING (privacy = 'public' OR creator_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.belay_group_participants 
      WHERE belay_group_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Gym members can create belay groups" 
  ON public.belay_groups FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = gym_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can update their belay groups" 
  ON public.belay_groups FOR UPDATE 
  TO authenticated USING (auth.uid() = creator_id);

-- RLS Policies for belay_group_participants
CREATE POLICY "Belay group participants viewable by group members" 
  ON public.belay_group_participants FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.belay_groups 
      WHERE id = belay_group_id AND (
        privacy = 'public' OR creator_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.belay_group_participants p2
          WHERE p2.belay_group_id = belay_group_id AND p2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can join belay groups" 
  ON public.belay_group_participants FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave belay groups" 
  ON public.belay_group_participants FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for belay_group_messages
CREATE POLICY "Belay group messages viewable by participants" 
  ON public.belay_group_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.belay_group_participants 
      WHERE belay_group_id = public.belay_group_messages.belay_group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages" 
  ON public.belay_group_messages FOR INSERT 
  TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.belay_group_participants 
      WHERE belay_group_id = public.belay_group_messages.belay_group_id 
      AND user_id = auth.uid()
    )
  );

-- Enable realtime for belay group tables
ALTER TABLE public.belay_groups REPLICA IDENTITY FULL;
ALTER TABLE public.belay_group_participants REPLICA IDENTITY FULL;
ALTER TABLE public.belay_group_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.belay_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.belay_group_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.belay_group_messages;

-- Create updated_at trigger for belay_groups
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_belay_groups_updated_at 
  BEFORE UPDATE ON public.belay_groups 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update belay group status when capacity is reached
CREATE OR REPLACE FUNCTION public.update_belay_group_status()
RETURNS TRIGGER AS $$
DECLARE
  participant_count INTEGER;
  group_capacity INTEGER;
BEGIN
  -- Get current participant count and capacity
  SELECT COUNT(*), bg.capacity 
  INTO participant_count, group_capacity
  FROM public.belay_group_participants bgp
  JOIN public.belay_groups bg ON bg.id = bgp.belay_group_id
  WHERE bgp.belay_group_id = COALESCE(NEW.belay_group_id, OLD.belay_group_id)
  GROUP BY bg.capacity;
  
  -- Update status based on capacity
  IF participant_count >= group_capacity THEN
    UPDATE public.belay_groups 
    SET status = 'full' 
    WHERE id = COALESCE(NEW.belay_group_id, OLD.belay_group_id);
  ELSE
    UPDATE public.belay_groups 
    SET status = 'active' 
    WHERE id = COALESCE(NEW.belay_group_id, OLD.belay_group_id) AND status = 'full';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for automatic status updates
CREATE TRIGGER update_belay_group_status_on_join
  AFTER INSERT ON public.belay_group_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_belay_group_status();

CREATE TRIGGER update_belay_group_status_on_leave
  AFTER DELETE ON public.belay_group_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_belay_group_status();