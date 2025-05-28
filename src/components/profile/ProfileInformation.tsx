
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, Check, X } from "lucide-react";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ClimbingInfoSection } from "./ClimbingInfoSection";
import { PrivacySettingsSection } from "./PrivacySettingsSection";

interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver: boolean;
  passenger_capacity?: number;
  climbing_description?: string;
  climbing_level?: string;
  climbing_experience?: string[];
  bio?: string;
  allow_profile_viewing?: boolean;
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
  show_trad_progress?: boolean;
  show_sport_progress?: boolean;
  show_top_rope_progress?: boolean;
}

interface ProfileInformationProps {
  profile: UserProfile | null;
  editing: boolean;
  formData: UserProfile;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormDataChange: (data: UserProfile) => void;
}

export function ProfileInformation({
  profile,
  editing,
  formData,
  onEdit,
  onSave,
  onCancel,
  onFormDataChange,
}: ProfileInformationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal details and preferences</CardDescription>
            </div>
            {!editing ? (
              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={onSave} size="sm" className="bg-[#E55A2B] hover:bg-[#D14B20] text-white">
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={onCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PersonalInfoSection 
            formData={formData}
            editing={editing}
            onFormDataChange={onFormDataChange}
          />
          <ClimbingInfoSection 
            formData={formData}
            editing={editing}
            onFormDataChange={onFormDataChange}
          />
        </CardContent>
      </Card>

      <PrivacySettingsSection 
        formData={formData}
        editing={editing}
        onFormDataChange={onFormDataChange}
      />
    </div>
  );
}
