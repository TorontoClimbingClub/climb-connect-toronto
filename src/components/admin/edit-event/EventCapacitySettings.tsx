
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventCapacitySettingsProps {
  formData: {
    max_participants: string | number;
    capacity_limit: string | number;
  };
  onChange: (field: string, value: string) => void;
}

export function EventCapacitySettings({ formData, onChange }: EventCapacitySettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="max_participants">Max Participants</Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={formData.max_participants}
          onChange={(e) => onChange('max_participants', e.target.value)}
          placeholder="No limit"
        />
      </div>
      <div>
        <Label htmlFor="capacity_limit">Capacity Limit</Label>
        <Input
          id="capacity_limit"
          type="number"
          min="1"
          value={formData.capacity_limit}
          onChange={(e) => onChange('capacity_limit', e.target.value)}
          placeholder="No limit"
        />
      </div>
    </div>
  );
}
