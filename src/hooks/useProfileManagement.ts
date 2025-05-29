
import { useEffect } from "react";
import { useProfileData } from "./useProfileData";
import { useProfileForm } from "./useProfileForm";
import { useProfileSave } from "./useProfileSave";

export function useProfileManagement() {
  const { profile, setProfile, loading } = useProfileData();
  const { editing, setEditing, formData, setFormData, updateFormData, handleCancel } = useProfileForm(profile);
  const { handleSave: saveProfile } = useProfileSave();

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      updateFormData(profile);
    }
  }, [profile, updateFormData]);

  const handleSave = async () => {
    await saveProfile(formData, setProfile, setEditing);
  };

  return {
    profile,
    loading,
    editing,
    formData,
    setEditing,
    setFormData,
    handleSave,
    handleCancel,
  };
}
