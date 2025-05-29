
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Car, Phone, Mountain, Package, Users, CheckCircle2 } from "lucide-react";
import { CommunityMember } from "@/types/community";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { getStyleColor, getDifficultyColor } from "@/utils/climbing-styles";

interface UserProfileOverlayProps {
  user: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileOverlay({ user, open, onOpenChange }: UserProfileOverlayProps) {
  const { user: currentUser } = useAuth();
  const { getUserCompletionStats } = useClimbCompletions();
  
  if (!user) return null;

  const userStats = getUserCompletionStats(user.id);
  const isOwnProfile = user.id === currentUser?.id;

  // Get completed routes for this user
  const completedRoutes = userStats.completions.map(completion => {
    const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
    return route ? { ...route, completedAt: completion.completed_at } : null;
  }).filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0;
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  const getHiddenStyles = () => {
    const hidden: string[] = [];
    if (user.show_trad_progress === false && !isOwnProfile) hidden.push('Trad');
    if (user.show_sport_progress === false && !isOwnProfile) hidden.push('Sport');
    if (user.show_top_rope_progress === false && !isOwnProfile) hidden.push('Top Rope');
    return hidden;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#E55A2B]">{user.full_name}</SheetTitle>
          <SheetDescription>
            View {isOwnProfile ? 'your' : `${user.full_name}'s`} climbing profile and achievements
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Contact & Transport */}
          <div className="space-y-3">
            {user.phone && (
              <div className="flex items-center text-sm text-stone-600">
                <Phone className="h-4 w-4 mr-2" />
                {user.phone}
              </div>
            )}
            
            {user.is_carpool_driver && (
              <Badge variant="secondary" className="text-sm">
                <Car className="h-4 w-4 mr-1" />
                Driver ({user.passenger_capacity} seats available)
              </Badge>
            )}
          </div>

          {/* Climbing Info */}
          {(user.show_climbing_level !== false || isOwnProfile) && (user.climbing_level || user.climbing_experience) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mountain className="h-5 w-5" />
                  Climbing Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.climbing_level && (
                  <p className="font-medium text-stone-700 mb-2">{user.climbing_level}</p>
                )}
                {user.climbing_experience && user.climbing_experience.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {user.climbing_experience.map((exp) => (
                      <Badge key={exp} variant="outline">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                )}
                {user.climbing_description && (
                  <p className="text-sm text-stone-600">{user.climbing_description}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          {(user.show_climbing_progress !== false || isOwnProfile) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Climbing Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CompletionProgressBars 
                  completions={userStats.completions} 
                  areaName="Rattlesnake Point"
                  hiddenStyles={getHiddenStyles()}
                />
              </CardContent>
            </Card>
          )}

          {/* Completed Routes */}
          {(user.show_completion_stats !== false || isOwnProfile) && completedRoutes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Completed Routes ({completedRoutes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {completedRoutes.slice(0, 10).map((route) => {
                    if (!route) return null;
                    return (
                      <div key={route.id} className="p-3 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-stone-900">{route.name}</h4>
                          <Badge className={getStyleColor(route.style)} variant="secondary">
                            {route.style}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                          <span className={getDifficultyColor(route.grade)}>
                            {route.grade}
                          </span>
                          <span>{route.area}</span>
                          <span className="text-xs">
                            {new Date(route.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {completedRoutes.length > 10 && (
                    <p className="text-sm text-stone-500 text-center">
                      +{completedRoutes.length - 10} more routes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Package className="h-4 w-4 mr-1" />
              </div>
              <p className="text-lg font-bold text-[#E55A2B]">{user.equipment_count}</p>
              <p className="text-xs text-stone-600">Gear Items</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 mr-1" />
              </div>
              <p className="text-lg font-bold text-[#E55A2B]">{user.events_count}</p>
              <p className="text-xs text-stone-600">Events Joined</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
