
-- Add RLS policies for leaderboard data visibility

-- Enable RLS on tables if not already enabled
ALTER TABLE public.event_attendance_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_event_attendance ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view event attendance approvals for leaderboard purposes
CREATE POLICY "Allow authenticated users to view attendance for leaderboards" 
ON public.event_attendance_approvals 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow all authenticated users to view profiles for leaderboard purposes
CREATE POLICY "Allow authenticated users to view profiles for leaderboards" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (allow_profile_viewing = true OR id = auth.uid());

-- Allow all authenticated users to view archived attendance for leaderboard purposes
CREATE POLICY "Allow authenticated users to view archived attendance for leaderboards" 
ON public.archived_event_attendance 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- Allow users to insert their own profile (for new user creation)
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- Allow admins and organizers to manage attendance approvals
CREATE POLICY "Admins and organizers can manage attendance" 
ON public.event_attendance_approvals 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'organizer')
  )
  OR user_id = auth.uid()
);

-- Allow users to see their own attendance records
CREATE POLICY "Users can view own attendance" 
ON public.event_attendance_approvals 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());
