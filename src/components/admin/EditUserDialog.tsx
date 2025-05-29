
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
}

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

export function EditUserDialog({ user, isOpen, onOpenChange, onSave }: EditUserDialogProps) {
  const [editingUser, setEditingUser] = useState<User>(user);

  const handleSave = () => {
    onSave(editingUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Update user information and settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
