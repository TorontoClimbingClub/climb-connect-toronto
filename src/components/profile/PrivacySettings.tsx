
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
  const handleCheckboxChange = (field: keyof UserProfile, checked: boolean) => {
    const updatedData = { ...formData, [field]: checked };
    onFormDataChange(updatedData);
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
            checked={formData.allow_profile_viewing ?? true}
            onCheckedChange={(checked) => 
              handleCheckboxChange('allow_profile_viewing', Boolean(checked))
            }
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
            checked={formData.show_climbing_level ?? true}
            onCheckedChange={(checked) => 
              handleCheckboxChange('show_climbing_level', Boolean(checked))
            }
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
            checked={formData.show_climbing_progress ?? false}
            onCheckedChange={(checked) => 
              handleCheckboxChange('show_climbing_progress', Boolean(checked))
            }
            disabled={!editing}
          />
        </div>

        {/* Individual Progress Settings - always show when progress bars are enabled */}
        <div className="ml-6 space-y-3 p-3 bg-stone-50 rounded-lg">
          <p className="text-sm font-medium text-stone-700">Individual Progress Bars:</p>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Trad Progress</Label>
              <p className="text-xs text-muted-foreground">Traditional climbing routes</p>
            </div>
            <Checkbox
              checked={formData.show_trad_progress ?? false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('show_trad_progress', Boolean(checked))
              }
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Sport Progress</Label>
              <p className="text-xs text-muted-foreground">Sport climbing routes</p>
            </div>
            <Checkbox
              checked={formData.show_sport_progress ?? false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('show_sport_progress', Boolean(checked))
              }
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Show Top Rope Progress</Label>
              <p className="text-xs text-muted-foreground">Top rope climbing routes</p>
            </div>
            <Checkbox
              checked={formData.show_top_rope_progress ?? false}
              onCheckedChange={(checked) => 
                handleCheckboxChange('show_top_rope_progress', Boolean(checked))
              }
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
            checked={formData.show_completion_stats ?? false}
            onCheckedChange={(checked) => 
              handleCheckboxChange('show_completion_stats', Boolean(checked))
            }
            disabled={!editing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
