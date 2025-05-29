
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Phone, Edit, Check, X } from "lucide-react";
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

interface BasicInformationProps {
  profile: UserProfile | null;
  editing: boolean;
  formData: UserProfile;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormDataChange: (data: UserProfile) => void;
}

export function BasicInformation({
  profile,
  editing,
  formData,
  onEdit,
  onSave,
  onCancel,
  onFormDataChange,
}: BasicInformationProps) {
  const handleInputChange = useCallback((field: string, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  }, [formData, onFormDataChange]);

  return (
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
      </CardContent>
    </Card>
  );
}
