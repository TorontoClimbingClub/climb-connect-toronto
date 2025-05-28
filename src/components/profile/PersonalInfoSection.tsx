
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

interface PersonalInfoSectionProps {
  formData: any;
  editing: boolean;
  onFormDataChange: (data: any) => void;
}

export function PersonalInfoSection({ formData, editing, onFormDataChange }: PersonalInfoSectionProps) {
  return (
    <>
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

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell other members about yourself, your interests, availability, etc."
          value={formData.bio || ''}
          onChange={(e) => onFormDataChange({ ...formData, bio: e.target.value })}
          disabled={!editing}
          rows={3}
        />
      </div>
    </>
  );
}
