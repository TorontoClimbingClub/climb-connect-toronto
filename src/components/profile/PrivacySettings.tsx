
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";

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

export function PrivacySettings({
  editing,
  formData,
  onFormDataChange,
}: PrivacySettingsProps) {
  
  // Test function to verify checkbox functionality
  const testCheckboxFunctionality = () => {
    console.log('=== CHECKBOX FUNCTIONALITY TEST ===');
    console.log('Current editing state:', editing);
    console.log('Current formData privacy values:', {
      allow_profile_viewing: formData.allow_profile_viewing,
      show_climbing_level: formData.show_climbing_level,
      show_climbing_progress: formData.show_climbing_progress,
      show_completion_stats: formData.show_completion_stats,
      show_trad_progress: formData.show_trad_progress,
      show_sport_progress: formData.show_sport_progress,
      show_top_rope_progress: formData.show_top_rope_progress,
    });
    console.log('onFormDataChange function available:', typeof onFormDataChange === 'function');
  };

  // Call test on every render
  testCheckboxFunctionality();

  const handleCheckboxChange = (field: keyof UserProfile, checked: boolean | "indeterminate") => {
    console.log(`🔄 Checkbox change initiated: ${field} = ${checked} (type: ${typeof checked})`);
    console.log('Previous value:', formData[field]);
    
    const booleanValue = checked === true;
    const updatedData = { 
      ...formData, 
      [field]: booleanValue
    };
    
    console.log('New value will be:', booleanValue);
    console.log('Full updated data:', updatedData);
    
    // Call the parent update function
    onFormDataChange(updatedData);
    console.log('✅ onFormDataChange called successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Control what other members see on your community member card</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Allow Profile Viewing</Label>
            <p className="text-sm text-muted-foreground">
              Let other members view your detailed profile by clicking your member card
            </p>
          </div>
          <Checkbox
            checked={Boolean(formData.allow_profile_viewing)}
            onCheckedChange={(checked) => {
              console.log('🎯 Allow Profile Viewing checkbox clicked, checked value:', checked);
              handleCheckboxChange('allow_profile_viewing', checked);
            }}
            disabled={!editing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Show Climbing Level</Label>
            <p className="text-sm text-muted-foreground">
              Display your climbing level on your member card
            </p>
          </div>
          <Checkbox
            checked={Boolean(formData.show_climbing_level)}
            onCheckedChange={(checked) => {
              console.log('🎯 Show Climbing Level checkbox clicked, checked value:', checked);
              handleCheckboxChange('show_climbing_level', checked);
            }}
            disabled={!editing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Show Progress Bars</Label>
            <p className="text-sm text-muted-foreground">
              Display progress bars on your member card
            </p>
          </div>
          <Checkbox
            checked={Boolean(formData.show_climbing_progress)}
            onCheckedChange={(checked) => {
              console.log('🎯 Show Progress Bars checkbox clicked, checked value:', checked);
              handleCheckboxChange('show_climbing_progress', checked);
            }}
            disabled={!editing}
          />
        </div>

        {/* Individual Progress Settings */}
        <div className="ml-6 space-y-3 p-3 bg-stone-50 rounded-lg">
          <p className="text-sm font-medium text-stone-700">Individual Progress Bars:</p>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Trad Progress</Label>
              <p className="text-xs text-muted-foreground">Traditional climbing routes</p>
            </div>
            <Checkbox
              checked={Boolean(formData.show_trad_progress)}
              onCheckedChange={(checked) => {
                console.log('🎯 Show Trad Progress checkbox clicked, checked value:', checked);
                handleCheckboxChange('show_trad_progress', checked);
              }}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Sport Progress</Label>
              <p className="text-xs text-muted-foreground">Sport climbing routes</p>
            </div>
            <Checkbox
              checked={Boolean(formData.show_sport_progress)}
              onCheckedChange={(checked) => {
                console.log('🎯 Show Sport Progress checkbox clicked, checked value:', checked);
                handleCheckboxChange('show_sport_progress', checked);
              }}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Top Rope Progress</Label>
              <p className="text-xs text-muted-foreground">Top rope climbing routes</p>
            </div>
            <Checkbox
              checked={Boolean(formData.show_top_rope_progress)}
              onCheckedChange={(checked) => {
                console.log('🎯 Show Top Rope Progress checkbox clicked, checked value:', checked);
                handleCheckboxChange('show_top_rope_progress', checked);
              }}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Show Completion Stats</Label>
            <p className="text-sm text-muted-foreground">
              Display the number of routes completed on your member card
            </p>
          </div>
          <Checkbox
            checked={Boolean(formData.show_completion_stats)}
            onCheckedChange={(checked) => {
              console.log('🎯 Show Completion Stats checkbox clicked, checked value:', checked);
              handleCheckboxChange('show_completion_stats', checked);
            }}
            disabled={!editing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
