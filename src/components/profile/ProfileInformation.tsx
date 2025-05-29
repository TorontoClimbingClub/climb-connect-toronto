
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Edit, Check, X, Mountain, Eye } from "lucide-react";
import { useCallback } from "react";

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

const CLIMBING_LEVELS = ['Never Climbed', 'Beginner', 'Intermediate', 'Advanced'];
const CLIMBING_EXPERIENCES = [
  'Top Rope',
  'Top Rope Belay', 
  'Lead',
  'Lead Belay',
  'Cleaning',
  'Sport Anchor Building',
  'Trad Second',
  'Trad First',
  'Trad Anchor Building',
  'Multi Pitch',
  'Rappelling'
];

export function ProfileInformation({
  profile,
  editing,
  formData,
  onEdit,
  onSave,
  onCancel,
  onFormDataChange,
}: ProfileInformationProps) {
  
  // Use useCallback to prevent unnecessary re-renders that might cause form data loss
  const handleExperienceChange = useCallback((experience: string, checked: boolean) => {
    const currentExperience = formData.climbing_experience || [];
    if (checked) {
      onFormDataChange({ 
        ...formData, 
        climbing_experience: [...currentExperience, experience] 
      });
    } else {
      onFormDataChange({ 
        ...formData, 
        climbing_experience: currentExperience.filter(exp => exp !== experience) 
      });
    }
  }, [formData, onFormDataChange]);

  // Memoize input change handlers to prevent form data loss
  const handleInputChange = useCallback((field: string, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  }, [formData, onFormDataChange]);

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
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name || ''}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={!editing}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!editing}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell other members about yourself, your interests, availability, etc."
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!editing}
              rows={3}
            />
          </div>

          {/* Climbing Level Section */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Mountain className="h-5 w-5 text-[#E55A2B]" />
              <Label className="text-base font-semibold">Climbing Information</Label>
            </div>
            
            <div>
              <Label htmlFor="climbing_level">Climbing Level</Label>
              <Select 
                value={formData.climbing_level || ''} 
                onValueChange={(value) => handleInputChange('climbing_level', value)}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your climbing level" />
                </SelectTrigger>
                <SelectContent>
                  {CLIMBING_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Climbing Experience</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {CLIMBING_EXPERIENCES.map((experience) => (
                  <div key={experience} className="flex items-center space-x-2">
                    <Checkbox
                      id={experience}
                      checked={(formData.climbing_experience || []).includes(experience)}
                      onCheckedChange={(checked) => 
                        handleExperienceChange(experience, checked as boolean)
                      }
                      disabled={!editing}
                    />
                    <Label 
                      htmlFor={experience}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {experience}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="climbing_description">Describe your climbing style</Label>
            <Textarea
              id="climbing_description"
              placeholder="Tell other members about your climbing experience, preferred styles, goals, etc."
              value={formData.climbing_description || ''}
              onChange={(e) => handleInputChange('climbing_description', e.target.value)}
              disabled={!editing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings Card */}
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
                handleInputChange('allow_profile_viewing', checked as boolean)
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
                handleInputChange('show_climbing_level', checked as boolean)
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
                handleInputChange('show_climbing_progress', checked as boolean)
              }
              disabled={!editing}
            />
          </div>

          {/* Individual Progress Settings - always show when progress bars are enabled */}
          {(formData.show_climbing_progress ?? false) && (
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
                    handleInputChange('show_trad_progress', checked as boolean)
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
                    handleInputChange('show_sport_progress', checked as boolean)
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
                    handleInputChange('show_top_rope_progress', checked as boolean)
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
              checked={formData.show_completion_stats ?? false}
              onCheckedChange={(checked) => 
                handleInputChange('show_completion_stats', checked as boolean)
              }
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
