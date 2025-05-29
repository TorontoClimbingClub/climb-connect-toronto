
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EventDateTimeLocationProps {
  formData: {
    date: string;
    time: string;
    end_time: string;
    location: string;
  };
  onChange: (field: string, value: string) => void;
}

export function EventDateTimeLocation({ formData, onChange }: EventDateTimeLocationProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => onChange('date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Start Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => onChange('time', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => onChange('end_time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Event location"
          required
        />
      </div>
    </div>
  );
}
