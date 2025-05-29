
import { BasicInformation } from "./BasicInformation";
import { ClimbingInformation } from "./ClimbingInformation";
import { PrivacySettings } from "./PrivacySettings";

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

export function ProfileInformation(props: ProfileInformationProps) {
  return (
    <div className="space-y-6">
      <BasicInformation {...props} />
      <ClimbingInformation 
        editing={props.editing}
        formData={props.formData}
        onFormDataChange={props.onFormDataChange}
      />
      <PrivacySettings 
        editing={props.editing}
        formData={props.formData}
        onFormDataChange={props.onFormDataChange}
      />
    </div>
  );
}
