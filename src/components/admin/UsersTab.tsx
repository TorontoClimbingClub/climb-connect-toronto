
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

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

interface UsersTabProps {
  users: User[];
  onUpdateUserRole: (userId: string, newRole: 'member' | 'organizer' | 'admin') => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string, newPassword: string) => void;
  onUpdateUser: (user: User) => void;
}

export function UsersTab({ 
  users, 
  onUpdateUserRole, 
  onDeleteUser, 
  onResetPassword,
  onUpdateUser 
}: UsersTabProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-emerald-800">User Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
          <CardDescription>Manage TCC member accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Climbing Level</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.full_name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.phone || 'Not provided'}</TableCell>
                  <TableCell>
                    <Select
                      value={user.user_role}
                      onValueChange={(value: 'member' | 'organizer' | 'admin') => onUpdateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="organizer">Organizer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {user.climbing_level || 'Not set'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_carpool_driver ? 'default' : 'secondary'}>
                      {user.is_carpool_driver ? `Yes (${user.passenger_capacity})` : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <ResetPasswordDialog 
                        userId={user.id}
                        userName={user.full_name}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            onUpdateUser(updatedUser);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
