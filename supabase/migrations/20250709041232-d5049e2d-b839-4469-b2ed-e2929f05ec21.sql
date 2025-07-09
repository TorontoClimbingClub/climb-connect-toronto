-- Comprehensive fix for belay groups infinite recursion
-- Drop ALL existing policies to ensure clean state

-- Drop all belay_groups policies
DROP POLICY IF EXISTS "Public belay groups viewable by all authenticated users" ON public.belay_groups;
DROP POLICY IF EXISTS "Belay groups viewable by authenticated users" ON public.belay_groups;
DROP POLICY IF EXISTS "Gym members can create belay groups" ON public.belay_groups;
DROP POLICY IF EXISTS "Creators can update their belay groups" ON public.belay_groups;

-- Drop all belay_group_participants policies  
DROP POLICY IF EXISTS "Belay group participants viewable by group members" ON public.belay_group_participants;
DROP POLICY IF EXISTS "Belay group participants viewable by authenticated users" ON public.belay_group_participants;
DROP POLICY IF EXISTS "Users can join belay groups" ON public.belay_group_participants;
DROP POLICY IF EXISTS "Users can leave belay groups" ON public.belay_group_participants;

-- Create completely non-recursive policies for belay_groups
CREATE POLICY "Belay groups viewable by all authenticated users"
  ON public.belay_groups FOR SELECT
  TO authenticated USING (
    privacy = 'public' OR 
    creator_id = auth.uid()
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

-- Create non-recursive policies for belay_group_participants
CREATE POLICY "Belay group participants viewable by all authenticated users"
  ON public.belay_group_participants FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can join belay groups" 
  ON public.belay_group_participants FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave belay groups" 
  ON public.belay_group_participants FOR DELETE 
  TO authenticated USING (auth.uid() = user_id);