
-- Update the handle_new_user function to set privacy defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    climbing_level, 
    climbing_experience,
    allow_profile_viewing,
    show_climbing_progress,
    show_completion_stats,
    show_climbing_level,
    show_trad_progress,
    show_sport_progress,
    show_top_rope_progress
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    'Never Climbed',
    '{}'::text[],
    true,  -- allow_profile_viewing default true
    false, -- show_climbing_progress default false
    false, -- show_completion_stats default false
    true,  -- show_climbing_level default true
    false, -- show_trad_progress default false
    false, -- show_sport_progress default false
    false  -- show_top_rope_progress default false
  );
  RETURN NEW;
END;
$function$;
