-- Migration: Add admin override policies for groups and events
-- This allows admin users to edit any group or event, not just their own

-- Drop existing restrictive UPDATE policies
DROP POLICY IF EXISTS "Group creators can update their groups" ON public.groups;
DROP POLICY IF EXISTS "Event creators can update their events" ON public.events;

-- Create new UPDATE policies that allow both creators AND admin users
CREATE POLICY "Group creators and admins can update groups" 
  ON public.groups FOR UPDATE 
  TO authenticated USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Event creators and admins can update events" 
  ON public.events FOR UPDATE 
  TO authenticated USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Optional: Add admin DELETE policies as well for completeness
-- (These may be useful for future admin functionality)
DROP POLICY IF EXISTS "Event creators can delete their events" ON public.events;

CREATE POLICY "Event creators and admins can delete events" 
  ON public.events FOR DELETE 
  TO authenticated USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Add DELETE policy for groups (this didn't exist before but might be useful)
CREATE POLICY "Group creators and admins can delete groups" 
  ON public.groups FOR DELETE 
  TO authenticated USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create helper function to check if current user is admin (for reusability)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
$$;