
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";

export function useProfileForm(initialProfile: UserProfile | null) {
  const [editing, setEditing] = useState(false);
  
  // Initialize form data based on whether we have an existing profile or not
  const getInitialFormData = (): UserProfile => {
    if (initialProfile) {
      console.log('🔄 useProfileForm: Using existing profile data:', initialProfile);
      return { ...initialProfile };
    }
    
    console.log('🔄 useProfileForm: Creating new profile with minimal defaults');
    return {
      id: '',
      full_name: '',
      phone: '',
      is_carpool_driver: false,
      passenger_capacity: 0,
      climbing_description: '',
      climbing_level: '',
      climbing_experience: [],
      bio: '',
      profile_photo_url: null,
      created_at: '',
      allow_profile_viewing: true,
      show_climbing_progress: false,
      show_completion_stats: false,
      show_climbing_level: true,
      show_trad_progress: false,
      show_sport_progress: false,
      show_top_rope_progress: false,
    };
  };

  const [formData, setFormData] = useState<UserProfile>(getInitialFormData());

  // Update form data when initial profile changes
  useEffect(() => {
    if (initialProfile) {
      console.log('🔄 useProfileForm useEffect: Updating form data with profile:', initialProfile);
      setFormData({ ...initialProfile });
    }
  }, [initialProfile]);

  const handleCancel = () => {
    if (initialProfile) {
      console.log('🔄 useProfileForm: Canceling changes, reverting to:', initialProfile);
      setFormData({ ...initialProfile });
    }
    setEditing(false);
  };

  return {
    editing,
    setEditing,
    formData,
    setFormData,
    handleCancel,
  };
}
