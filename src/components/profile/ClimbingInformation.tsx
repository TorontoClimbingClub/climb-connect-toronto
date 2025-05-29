
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mountain } from "lucide-react";
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

interface ClimbingInformationProps {
  editing: boolean;
  formData: UserProfile;
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

export function ClimbingInformation({
  editing,
  formData,
  onFormDataChange,
}: ClimbingInformationProps) {
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

  const handleInputChange = useCallback((field: string, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  }, [formData, onFormDataChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-[#E55A2B]" />
          Climbing Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
  );
}
