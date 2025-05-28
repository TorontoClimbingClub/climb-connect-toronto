
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Edit, Check, X, Mountain, Eye, EyeOff } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver: boolean;
  passenger_capacity?: number;
  climbing_description?: string;
  climbing_level?: string;
  climbing_experience?: string[];
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
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
  'Anchor Building',
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
  const handleExperienceChange = (experience: string, checked: boolean) => {
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
  };

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
              value={formData.full_name}
              onChange={(e) => onFormDataChange({ ...formData, full_name: e.target.value })}
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
                onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
                disabled={!editing}
                className="pl-10"
              />
            </div>
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
                onValueChange={(value) => onFormDataChange({ ...formData, climbing_level: value })}
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
              onChange={(e) => onFormDataChange({ ...formData, climbing_description: e.target.value })}
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
          <CardDescription>Control what other members can see about your climbing progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label className="text-base">Show Climbing Progress</Label>
              <p className="text-sm text-muted-foreground">
                Display progress bars showing your completed routes
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Completion Stats</Label>
              <p className="text-sm text-muted-foreground">
                Display the number of routes you've completed
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
    </div>
  );
}
