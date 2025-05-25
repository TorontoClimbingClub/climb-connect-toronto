
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordDialogProps {
  userId: string;
  userName: string;
}

export function ResetPasswordDialog({ userId, userName }: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Note: This would require service role access which we don't have with anon key
    toast({
      title: "Feature Unavailable",
      description: "Password reset requires service role configuration",
      variant: "destructive",
    });
    
    setOpen(false);
    setNewPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Key className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {userName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleResetPassword}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset Password
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setNewPassword("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
