-- Drop the problematic policy
DROP POLICY IF EXISTS "Belay group participants viewable by group members" ON public.belay_group_participants;

-- Create a simpler, non-recursive policy for belay_group_participants
CREATE POLICY "Belay group participants viewable by authenticated users"
  ON public.belay_group_participants FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.belay_groups
      WHERE id = belay_group_id AND (
        privacy = 'public' OR
        creator_id = auth.uid() OR
        user_id = auth.uid()
      )
    )
  );

-- Also update the belay_groups policy to be simpler and avoid potential recursion
DROP POLICY IF EXISTS "Public belay groups viewable by all authenticated users" ON public.belay_groups;

CREATE POLICY "Belay groups viewable by authenticated users"
  ON public.belay_groups FOR SELECT
  TO authenticated USING (
    privacy = 'public' OR
    creator_id = auth.uid() OR
    id IN (
      SELECT belay_group_id FROM public.belay_group_participants
      WHERE user_id = auth.uid()
    )
  );