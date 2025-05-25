
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Car, Edit, Check, X } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver: boolean;
  passenger_capacity?: number;
  climbing_description?: string;
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

export function ProfileInformation({
  profile,
  editing,
  formData,
  onEdit,
  onSave,
  onCancel,
  onFormDataChange,
}: ProfileInformationProps) {
  return (
    <Card className="mb-6">
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

        {/* Carpool Settings */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-[#E55A2B]" />
              <div>
                <Label htmlFor="is_carpool_driver">I can drive to events</Label>
                <p className="text-sm text-stone-600">Offer rides to fellow climbers</p>
              </div>
            </div>
            <Switch
              id="is_carpool_driver"
              checked={formData.is_carpool_driver}
              onCheckedChange={(checked) => onFormDataChange({ ...formData, is_carpool_driver: checked })}
              disabled={!editing}
            />
          </div>

          {formData.is_carpool_driver && (
            <div>
              <Label htmlFor="passenger_capacity">Available Seats</Label>
              <Input
                id="passenger_capacity"
                type="number"
                min="1"
                max="8"
                value={formData.passenger_capacity || ''}
                onChange={(e) => onFormDataChange({ ...formData, passenger_capacity: parseInt(e.target.value) || 0 })}
                disabled={!editing}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
