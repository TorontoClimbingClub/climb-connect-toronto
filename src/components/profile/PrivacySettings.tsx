
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

interface PrivacySettingsProps {
  editing: boolean;
  formData: UserProfile;
  onFormDataChange: (data: UserProfile) => void;
}

export function PrivacySettings({ editing, formData, onFormDataChange }: PrivacySettingsProps) {
  console.log('🔒 PrivacySettings render - editing:', editing, 'formData privacy values:', {
    allow_profile_viewing: formData.allow_profile_viewing,
    show_climbing_level: formData.show_climbing_level,
    show_climbing_progress: formData.show_climbing_progress,
    show_completion_stats: formData.show_completion_stats,
    show_trad_progress: formData.show_trad_progress,
    show_sport_progress: formData.show_sport_progress,
    show_top_rope_progress: formData.show_top_rope_progress,
  });

  const handlePrivacyChange = (field: keyof UserProfile, value: boolean) => {
    console.log('🔒 Privacy change:', field, 'to', value);
    const updatedData = {
      ...formData,
      [field]: value,
    };
    console.log('🔒 Updated formData:', updatedData);
    onFormDataChange(updatedData);
  };

  if (!editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-stone-600">Profile Viewing: {formData.allow_profile_viewing ? 'Enabled' : 'Disabled'}</p>
            <p className="text-sm text-stone-600">Show Climbing Level: {formData.show_climbing_level ? 'Yes' : 'No'}</p>
            <p className="text-sm text-stone-600">Show Climbing Progress: {formData.show_climbing_progress ? 'Yes' : 'No'}</p>
            <p className="text-sm text-stone-600">Show Completion Stats: {formData.show_completion_stats ? 'Yes' : 'No'}</p>
            <p className="text-sm text-stone-600">Show Trad Progress: {formData.show_trad_progress ? 'Yes' : 'No'}</p>
            <p className="text-sm text-stone-600">Show Sport Progress: {formData.show_sport_progress ? 'Yes' : 'No'}</p>
            <p className="text-sm text-stone-600">Show Top Rope Progress: {formData.show_top_rope_progress ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allow_profile_viewing"
              checked={Boolean(formData.allow_profile_viewing)}
              onCheckedChange={(checked) => handlePrivacyChange('allow_profile_viewing', Boolean(checked))}
            />
            <Label htmlFor="allow_profile_viewing">Allow others to view my profile</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_climbing_level"
              checked={Boolean(formData.show_climbing_level)}
              onCheckedChange={(checked) => handlePrivacyChange('show_climbing_level', Boolean(checked))}
            />
            <Label htmlFor="show_climbing_level">Show my climbing level</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_climbing_progress"
              checked={Boolean(formData.show_climbing_progress)}
              onCheckedChange={(checked) => handlePrivacyChange('show_climbing_progress', Boolean(checked))}
            />
            <Label htmlFor="show_climbing_progress">Show my climbing progress</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_completion_stats"
              checked={Boolean(formData.show_completion_stats)}
              onCheckedChange={(checked) => handlePrivacyChange('show_completion_stats', Boolean(checked))}
            />
            <Label htmlFor="show_completion_stats">Show my completion statistics</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_trad_progress"
              checked={Boolean(formData.show_trad_progress)}
              onCheckedChange={(checked) => handlePrivacyChange('show_trad_progress', Boolean(checked))}
            />
            <Label htmlFor="show_trad_progress">Show my traditional climbing progress</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_sport_progress"
              checked={Boolean(formData.show_sport_progress)}
              onCheckedChange={(checked) => handlePrivacyChange('show_sport_progress', Boolean(checked))}
            />
            <Label htmlFor="show_sport_progress">Show my sport climbing progress</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_top_rope_progress"
              checked={Boolean(formData.show_top_rope_progress)}
              onCheckedChange={(checked) => handlePrivacyChange('show_top_rope_progress', Boolean(checked))}
            />
            <Label htmlFor="show_top_rope_progress">Show my top rope progress</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
