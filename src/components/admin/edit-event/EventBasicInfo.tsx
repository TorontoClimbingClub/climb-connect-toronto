
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventBasicInfoProps {
  formData: {
    title: string;
    description: string;
    details: string;
  };
  onChange: (field: string, value: string) => void;
}

export function EventBasicInfo({ formData, onChange }: EventBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Brief event summary..."
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => onChange('details', e.target.value)}
          placeholder="Additional event details, what to bring, meeting instructions..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
