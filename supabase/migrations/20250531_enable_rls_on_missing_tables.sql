
-- Enable Row Level Security on climbing_styles_ref table
ALTER TABLE public.climbing_styles_ref ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on session_goals_ref table  
ALTER TABLE public.session_goals_ref ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for climbing_styles_ref (read-only for all authenticated users)
CREATE POLICY "Allow authenticated users to read climbing styles" 
ON public.climbing_styles_ref 
FOR SELECT 
TO authenticated 
USING (true);

-- Add RLS policies for session_goals_ref (read-only for all authenticated users)
CREATE POLICY "Allow authenticated users to read session goals" 
ON public.session_goals_ref 
FOR SELECT 
TO authenticated 
USING (true);

-- Add RLS policies for training_sessions table
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own training sessions" 
ON public.training_sessions 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own training sessions" 
ON public.training_sessions 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own training sessions" 
ON public.training_sessions 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own training sessions" 
ON public.training_sessions 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Add RLS policies for session_climbs table
ALTER TABLE public.session_climbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view climbs from their own sessions" 
ON public.session_climbs 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_climbs.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create climbs for their own sessions" 
ON public.session_climbs 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_climbs.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update climbs from their own sessions" 
ON public.session_climbs 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_climbs.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete climbs from their own sessions" 
ON public.session_climbs 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_climbs.session_id 
    AND user_id = auth.uid()
  )
);

-- Add RLS policies for session_techniques table
ALTER TABLE public.session_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view techniques from their own sessions" 
ON public.session_techniques 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_techniques.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create techniques for their own sessions" 
ON public.session_techniques 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_techniques.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update techniques from their own sessions" 
ON public.session_techniques 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_techniques.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete techniques from their own sessions" 
ON public.session_techniques 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_techniques.session_id 
    AND user_id = auth.uid()
  )
);

-- Add RLS policies for session_gear table
ALTER TABLE public.session_gear ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gear from their own sessions" 
ON public.session_gear 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_gear.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create gear for their own sessions" 
ON public.session_gear 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_gear.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update gear from their own sessions" 
ON public.session_gear 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_gear.session_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete gear from their own sessions" 
ON public.session_gear 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.training_sessions 
    WHERE id = session_gear.session_id 
    AND user_id = auth.uid()
  )
);
