
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface User {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  is_carpool_driver?: boolean;
  passenger_capacity?: number;
  created_at: string;
  updated_at?: string;
  user_role?: 'member' | 'organizer' | 'admin';
  climbing_level?: string;
  climbing_experience?: string[];
  bio?: string;
  climbing_description?: string;
  allow_profile_viewing?: boolean;
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
  show_trad_progress?: boolean;
  show_sport_progress?: boolean;
  show_top_rope_progress?: boolean;
}

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

const climbingLevels = [
  "Never Climbed",
  "Beginner (5.6 and below)",
  "Intermediate (5.7-5.9)",
  "Advanced (5.10-5.12)",
  "Expert (5.13+)"
];

const experienceOptions = [
  "Top Rope",
  "Lead Climbing",
  "Traditional",
  "Sport Climbing",
  "Bouldering",
  "Alpine Climbing",
  "Ice Climbing",
  "Aid Climbing"
];

export function EditUserDialog({ user, isOpen, onOpenChange, onSave }: EditUserDialogProps) {
  const [editingUser, setEditingUser] = useState<User>(user);

  const handleSave = () => {
    onSave(editingUser);
  };

  const addExperience = (experience: string) => {
    if (!editingUser.climbing_experience?.includes(experience)) {
      setEditingUser({
        ...editingUser,
        climbing_experience: [...(editingUser.climbing_experience || []), experience]
      });
    }
  };

  const removeExperience = (experience: string) => {
    setEditingUser({
      ...editingUser,
      climbing_experience: editingUser.climbing_experience?.filter(exp => exp !== experience) || []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Update user information and settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input value={editingUser.email || ''} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed from admin panel</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    full_name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <Input
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    phone: e.target.value
                  })}
                />
              </div>
            </div>
          </div>

          {/* Carpool Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Carpool Information</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={editingUser.is_carpool_driver || false}
                onCheckedChange={(checked) => setEditingUser({
                  ...editingUser,
                  is_carpool_driver: Boolean(checked)
                })}
              />
              <Label className="text-sm font-medium">Carpool Driver</Label>
            </div>
            {editingUser.is_carpool_driver && (
              <div>
                <Label className="text-sm font-medium">Passenger Capacity</Label>
                <Input
                  type="number"
                  value={editingUser.passenger_capacity || 0}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    passenger_capacity: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            )}
          </div>

          {/* Climbing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Climbing Information</h3>
            <div>
              <Label className="text-sm font-medium">Climbing Level</Label>
              <Select
                value={editingUser.climbing_level || ''}
                onValueChange={(value) => setEditingUser({
                  ...editingUser,
                  climbing_level: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select climbing level" />
                </SelectTrigger>
                <SelectContent>
                  {climbingLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Climbing Experience</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingUser.climbing_experience?.map((exp) => (
                  <Badge key={exp} variant="secondary" className="flex items-center gap-1">
                    {exp}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeExperience(exp)}
                    />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={addExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Add climbing experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions
                    .filter(exp => !editingUser.climbing_experience?.includes(exp))
                    .map((exp) => (
                      <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Climbing Description</Label>
              <Textarea
                value={editingUser.climbing_description || ''}
                onChange={(e) => setEditingUser({
                  ...editingUser,
                  climbing_description: e.target.value
                })}
                placeholder="Describe climbing style, goals, or preferences..."
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                value={editingUser.bio || ''}
                onChange={(e) => setEditingUser({
                  ...editingUser,
                  bio: e.target.value
                })}
                placeholder="Personal bio..."
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.allow_profile_viewing)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    allow_profile_viewing: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Allow profile viewing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_climbing_level)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_climbing_level: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show climbing level</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_climbing_progress)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_climbing_progress: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show climbing progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_completion_stats)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_completion_stats: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show completion stats</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_trad_progress)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_trad_progress: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show trad progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_sport_progress)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_sport_progress: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show sport progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={Boolean(editingUser.show_top_rope_progress)}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    show_top_rope_progress: Boolean(checked)
                  })}
                />
                <Label className="text-sm">Show top rope progress</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
