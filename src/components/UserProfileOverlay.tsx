
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mountain, User, Phone } from "lucide-react";
import { CompletionChart } from "./CompletionChart";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { CommunityMember } from "@/types/community";

interface UserProfileOverlayProps {
  user: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileOverlay({ user, open, onOpenChange }: UserProfileOverlayProps) {
  const { getUserCompletionStats, fetchCompletions, completions } = useClimbCompletions();
  const [userCompletions, setUserCompletions] = useState<any[]>([]);

  useEffect(() => {
    if (user && open) {
      // Get completions for this specific user
      const userStats = getUserCompletionStats(user.id);
      setUserCompletions(userStats.completions);
    }
  }, [user, open, completions, getUserCompletionStats]);

  if (!user) return null;

  const userInitials = user.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#E55A2B] text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-[#E55A2B]">{user.full_name}</h2>
              <p className="text-stone-600 text-sm">Community Member</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="flex items-center gap-4 text-sm">
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-stone-500" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Climbing Info */}
          {(user.climbing_level || user.climbing_experience) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-[#E55A2B]" />
                <h3 className="font-semibold">Climbing Information</h3>
              </div>
              
              {user.climbing_level && (
                <div>
                  <span className="text-sm font-medium">Level: </span>
                  <Badge variant="outline">{user.climbing_level}</Badge>
                </div>
              )}
              
              {user.climbing_experience && user.climbing_experience.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Experience: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.climbing_experience.map((exp) => (
                      <Badge key={exp} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Climbing Description */}
          {user.climbing_description && (
            <div>
              <h3 className="font-semibold mb-2">About Their Climbing</h3>
              <p className="text-stone-700 text-sm bg-stone-50 p-3 rounded-lg">
                {user.climbing_description}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-stone-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-[#E55A2B]">{userCompletions.length}</div>
              <div className="text-xs text-stone-600">Routes Completed</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-[#E55A2B]">{user.equipment_count || 0}</div>
              <div className="text-xs text-stone-600">Equipment Items</div>
            </div>
            <div className="bg-stone-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-[#E55A2B]">{user.events_count || 0}</div>
              <div className="text-xs text-stone-600">Events Joined</div>
            </div>
          </div>

          {/* Completion Progress Chart */}
          <CompletionChart 
            completions={userCompletions} 
            title="Beta Boards Progress"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
