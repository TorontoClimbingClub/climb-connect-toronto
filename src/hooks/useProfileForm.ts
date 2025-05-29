
import { useState } from "react";
import { UserProfile } from "@/types";

export function useProfileForm(initialProfile: UserProfile | null) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    full_name: '',
    phone: '',
    is_carpool_driver: false,
    passenger_capacity: 0,
    climbing_description: '',
    climbing_level: '',
    climbing_experience: [],
    bio: '',
    allow_profile_viewing: true,
    show_climbing_progress: false,
    show_completion_stats: false,
    show_climbing_level: true,
    show_trad_progress: false,
    show_sport_progress: false,
    show_top_rope_progress: false,
    created_at: '',
  });

  // Update form data when profile changes
  const updateFormData = (profile: UserProfile) => {
    setFormData(profile);
  };

  const handleCancel = () => {
    if (initialProfile) {
      setFormData(initialProfile);
    }
    setEditing(false);
  };

  return {
    editing,
    setEditing,
    formData,
    setFormData,
    updateFormData,
    handleCancel,
  };
}
