
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventDifficultySettingsProps {
  formData: {
    difficulty_level: string;
    required_climbing_level: string;
  };
  onChange: (field: string, value: string) => void;
}

export function EventDifficultySettings({ formData, onChange }: EventDifficultySettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="difficulty_level">Difficulty Level</Label>
        <Select 
          value={formData.difficulty_level} 
          onValueChange={(value) => onChange('difficulty_level', value === "none" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No difficulty level</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="required_climbing_level">Required Climbing Level</Label>
        <Select 
          value={formData.required_climbing_level} 
          onValueChange={(value) => onChange('required_climbing_level', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select required climbing level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No requirement</SelectItem>
            <SelectItem value="Never Climbed">Never Climbed</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
