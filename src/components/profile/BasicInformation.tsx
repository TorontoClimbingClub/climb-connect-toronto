
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X, User, Phone, FileText } from "lucide-react";
import { validateInput, sanitizeHtml, getGenericErrorMessage } from "@/utils/security";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";

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
  profile_photo_url?: string | null;
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validateInput.name(formData.full_name)) {
      errors.full_name = "Please enter a valid name (2-50 characters, letters only)";
    }

    if (formData.phone && !validateInput.phone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (formData.bio && !validateInput.bio(formData.bio)) {
      errors.bio = "Bio must be 500 characters or less";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sanitize text inputs before saving
      const sanitizedData = {
        ...formData,
        full_name: sanitizeHtml(formData.full_name.trim()),
        bio: formData.bio ? sanitizeHtml(formData.bio.trim()) : formData.bio,
      };
      onFormDataChange(sanitizedData);
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpdate = (photoUrl: string | null) => {
    onFormDataChange({ ...formData, profile_photo_url: photoUrl });
  };

  const getUserInitials = () => {
    const name = profile?.full_name || formData.full_name || "User";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
        {!editing && (
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo Section */}
        <div>
          <Label className="text-sm font-medium text-stone-500 mb-3 block">Profile Photo</Label>
          <ProfilePhotoUpload 
            currentPhotoUrl={formData.profile_photo_url}
            onPhotoUpdate={handlePhotoUpdate}
            userInitials={getUserInitials()}
          />
        </div>

        {editing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
                className={validationErrors.full_name ? 'border-red-500' : ''}
                maxLength={50}
              />
              {validationErrors.full_name && (
                <p className="text-sm text-red-600">{validationErrors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className={`pl-10 ${validationErrors.phone ? 'border-red-500' : ''}`}
                  maxLength={15}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className={`pl-10 min-h-[100px] ${validationErrors.bio ? 'border-red-500' : ''}`}
                  maxLength={500}
                />
              </div>
              <div className="flex justify-between items-center">
                {validationErrors.bio && (
                  <p className="text-sm text-red-600">{validationErrors.bio}</p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {(formData.bio || "").length}/500 characters
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave} 
                className="bg-[#E55A2B] hover:bg-orange-700"
                disabled={!validateInput.name(formData.full_name)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={onCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label className="text-sm font-medium text-stone-500">Full Name</Label>
              <p className="text-stone-900 font-medium">{sanitizeHtml(profile.full_name)}</p>
            </div>

            {profile.phone && (
              <div>
                <Label className="text-sm font-medium text-stone-500">Phone</Label>
                <p className="text-stone-900">{sanitizeHtml(profile.phone)}</p>
              </div>
            )}

            {profile.bio && (
              <div>
                <Label className="text-sm font-medium text-stone-500">Bio</Label>
                <div 
                  className="text-stone-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.bio) }}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {profile.is_carpool_driver && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Carpool Driver
                </Badge>
              )}
              {profile.is_carpool_driver && profile.passenger_capacity && profile.passenger_capacity > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {profile.passenger_capacity} seats available
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
