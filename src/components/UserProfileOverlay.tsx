
import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Phone, Mountain, Car, Package, Users, Calendar } from "lucide-react";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { CompletedRoutesList } from "@/components/profile/CompletedRoutesList";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { CommunityMember } from "@/types/community";

interface UserProfileOverlayProps {
  user: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileOverlay = memo(function UserProfileOverlay({
  user,
  open,
  onOpenChange
}: UserProfileOverlayProps) {
  const { getUserCompletionStats } = useClimbCompletions();

  if (!user) return null;

  const userStats = getUserCompletionStats(user.id);
  const completions = userStats?.completions || [];

  const handleClose = () => {
    onOpenChange(false);
  };

  const getUserInitials = () => {
    return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate privacy-filtered hidden styles
  const getHiddenStyles = () => {
    const hidden: string[] = [];
    if (!user.show_trad_progress) hidden.push('Trad');
    if (!user.show_sport_progress) hidden.push('Sport');
    if (!user.show_top_rope_progress) hidden.push('Top Rope');
    return hidden;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby="user-profile-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profile_photo_url || undefined} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl font-bold text-[#E55A2B]">
              {user.full_name}'s Profile
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-[#E55A2B] focus:ring-offset-2"
            aria-label="Close profile"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div id="user-profile-description" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" aria-hidden="true" />
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Name:</span>
                  <span>{user.full_name}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {user.is_carpool_driver && (
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-3 w-3" aria-hidden="true" />
                    <Badge variant="secondary" className="text-xs">
                      Driver ({user.passenger_capacity} seats available)
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Climbing Information */}
          {user.show_climbing_level && (user.climbing_level || user.climbing_experience?.length > 0 || user.climbing_description) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mountain className="h-4 w-4" aria-hidden="true" />
                  Climbing Information
                </h3>
                
                <div className="space-y-3">
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
                          <Badge key={exp} variant="outline" className="text-xs">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user.climbing_description && (
                    <div>
                      <span className="text-sm font-medium">Description: </span>
                      <p className="text-sm text-gray-700 mt-1 break-words">{user.climbing_description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bio */}
          {user.bio && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">About</h3>
                <p className="text-sm text-gray-700 break-words">{user.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Climbing Progress */}
          {user.show_climbing_progress && completions.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Climbing Progress</h3>
                <CompletionProgressBars 
                  completions={completions}
                  compact={false}
                  areaName="Rattlesnake Point"
                  hiddenStyles={getHiddenStyles()}
                />
              </CardContent>
            </Card>
          )}

          {/* Activity Stats */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Activity
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span>{user.equipment_count || 0} gear items</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span>{user.events_count || 0} events joined</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Routes */}
          {user.show_completion_stats && (
            <CompletedRoutesList completions={completions} userId={user.id} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
