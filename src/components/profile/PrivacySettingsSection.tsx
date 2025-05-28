
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

interface PrivacySettingsSectionProps {
  formData: any;
  editing: boolean;
  onFormDataChange: (data: any) => void;
}

export function PrivacySettingsSection({ formData, editing, onFormDataChange }: PrivacySettingsSectionProps) {
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
              onFormDataChange({ ...formData, allow_profile_viewing: checked as boolean })
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
              onFormDataChange({ ...formData, show_climbing_level: checked as boolean })
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
            checked={formData.show_climbing_progress ?? true}
            onCheckedChange={(checked) => 
              onFormDataChange({ ...formData, show_climbing_progress: checked as boolean })
            }
            disabled={!editing}
          />
        </div>

        {/* Granular Progress Settings */}
        {formData.show_climbing_progress && (
          <div className="ml-6 space-y-3 p-3 bg-stone-50 rounded-lg">
            <p className="text-sm font-medium text-stone-700">Individual Progress Bars:</p>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Show Trad Progress</Label>
                <p className="text-xs text-muted-foreground">Traditional climbing routes</p>
              </div>
              <Checkbox
                checked={formData.show_trad_progress ?? true}
                onCheckedChange={(checked) => 
                  onFormDataChange({ ...formData, show_trad_progress: checked as boolean })
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
                checked={formData.show_sport_progress ?? true}
                onCheckedChange={(checked) => 
                  onFormDataChange({ ...formData, show_sport_progress: checked as boolean })
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
                checked={formData.show_top_rope_progress ?? true}
                onCheckedChange={(checked) => 
                  onFormDataChange({ ...formData, show_top_rope_progress: checked as boolean })
                }
                disabled={!editing}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Show Completion Stats</Label>
            <p className="text-sm text-muted-foreground">
              Display the number of routes completed on your member card
            </p>
          </div>
          <Checkbox
            checked={formData.show_completion_stats ?? true}
            onCheckedChange={(checked) => 
              onFormDataChange({ ...formData, show_completion_stats: checked as boolean })
            }
            disabled={!editing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
