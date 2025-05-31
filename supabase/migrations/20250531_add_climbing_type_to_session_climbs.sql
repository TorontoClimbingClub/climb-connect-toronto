
-- Add climbing_type column to session_climbs table
ALTER TABLE public.session_climbs 
ADD COLUMN climbing_type text;

-- Add comment to describe the new column
COMMENT ON COLUMN public.session_climbs.climbing_type IS 'Type of climbing: bouldering, slab, crack, etc.';
