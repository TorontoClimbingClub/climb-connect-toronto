
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mountain } from "lucide-react";

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
  'Rappelling'
];

interface ClimbingInfoSectionProps {
  formData: any;
  editing: boolean;
  onFormDataChange: (data: any) => void;
}

export function ClimbingInfoSection({ formData, editing, onFormDataChange }: ClimbingInfoSectionProps) {
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
        climbing_experience: currentExperience.filter((exp: string) => exp !== experience) 
      });
    }
  };

  return (
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
    </div>
  );
}
