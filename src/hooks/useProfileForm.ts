
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";

export function useProfileForm(initialProfile: UserProfile | null) {
  const [editing, setEditing] = useState(false);
  
  // Initialize form data based on whether we have an existing profile or not
  const getInitialFormData = (): UserProfile => {
    if (initialProfile) {
      console.log('🔄 useProfileForm: Using existing profile data:', initialProfile);
      // Use existing profile data exactly as it is
      return initialProfile;
    }
    
    console.log('🔄 useProfileForm: Creating new profile with minimal defaults');
    // Minimal defaults for new profiles - let database defaults handle privacy settings
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
      created_at: '',
      // Remove privacy setting defaults - let them come from database
    };
  };

  const [formData, setFormData] = useState<UserProfile>(getInitialFormData());

  // Update form data when initial profile changes
  useEffect(() => {
    if (initialProfile) {
      console.log('🔄 useProfileForm useEffect: Updating form data with profile:', initialProfile);
      setFormData(initialProfile);
    }
  }, [initialProfile]);

  // Update form data when profile changes
  const updateFormData = (profile: UserProfile) => {
    console.log('🔄 useProfileForm: updateFormData called with:', profile);
    setFormData(profile);
  };

  const handleCancel = () => {
    if (initialProfile) {
      console.log('🔄 useProfileForm: Canceling changes, reverting to:', initialProfile);
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
