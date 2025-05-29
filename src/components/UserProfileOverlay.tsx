
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mountain, Phone, Eye, EyeOff, ExternalLink } from "lucide-react";
import { CompletionProgressBars } from "./CompletionProgressBars";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityMember } from "@/types/community";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useNavigate } from "react-router-dom";

interface UserProfileOverlayProps {
  user: CommunityMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileOverlay({ user, open, onOpenChange }: UserProfileOverlayProps) {
  const { getUserCompletionStats, completions } = useClimbCompletions();
  const { user: currentUser } = useAuth();
  const [userCompletions, setUserCompletions] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const isOwnProfile = currentUser?.id === user.id;
  const canShowClimbingLevel = user.show_climbing_level !== false || isOwnProfile;
  const canShowClimbingProgress = user.show_climbing_progress !== false || isOwnProfile;
  const canShowCompletionStats = user.show_completion_stats !== false || isOwnProfile;

  // Check if user allows profile viewing - but don't show this restriction to their own profile
  if (!user.allow_profile_viewing && !isOwnProfile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
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

          <div className="bg-stone-50 p-6 rounded-lg text-center">
            <EyeOff className="h-8 w-8 text-stone-400 mx-auto mb-2" />
            <p className="text-stone-600">This member's profile is private</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Get hidden styles based on privacy settings (but show everything for own profile)
  const getHiddenStyles = () => {
    if (isOwnProfile) return []; // Show everything for own profile
    
    const hidden: string[] = [];
    if (user.show_trad_progress === false) hidden.push('Trad');
    if (user.show_sport_progress === false) hidden.push('Sport');
    if (user.show_top_rope_progress === false) hidden.push('Top Rope');
    return hidden;
  };

  // Get completed routes with details
  const completedRoutes = userCompletions.map(completion => {
    const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
    return route ? { ...route, completedAt: completion.completed_at } : null;
  }).filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0;
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-orange-100 text-orange-800';
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Top Rope':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (grade: string) => {
    if (grade.includes('5.1') && (grade.includes('0') || grade.includes('1') || grade.includes('2'))) {
      return 'text-red-600 font-bold';
    }
    if (grade.includes('5.9') || grade.includes('5.10')) {
      return 'text-orange-600 font-semibold';
    }
    if (grade.includes('5.7') || grade.includes('5.8')) {
      return 'text-yellow-600 font-medium';
    }
    return 'text-green-600';
  };

  const handleRouteClick = (routeId: string) => {
    navigate(`/routes/${routeId}`);
    onOpenChange(false);
  };

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

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-stone-700 text-sm bg-stone-50 p-3 rounded-lg">
                {user.bio}
              </p>
            </div>
          )}

          {/* Climbing Info */}
          {canShowClimbingLevel && (user.climbing_level || user.climbing_experience) && (
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
              <div className="text-2xl font-bold text-[#E55A2B]">
                {canShowCompletionStats ? userCompletions.length : '•••'}
              </div>
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

          {/* Completion Progress */}
          {canShowClimbingProgress ? (
            <CompletionProgressBars 
              completions={userCompletions} 
              title={`${user.full_name}'s Progress`}
              areaName="Rattlesnake Point"
              hiddenStyles={getHiddenStyles()}
            />
          ) : (
            <div className="bg-stone-50 p-6 rounded-lg text-center">
              <EyeOff className="h-8 w-8 text-stone-400 mx-auto mb-2" />
              <p className="text-stone-600">Climbing progress is private</p>
            </div>
          )}

          {/* Completed Routes List */}
          {canShowCompletionStats && completedRoutes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Completed Routes ({completedRoutes.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {completedRoutes.map((route) => {
                  if (!route) return null;
                  return (
                    <div
                      key={route.id}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      onClick={() => handleRouteClick(route.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-stone-900 text-sm">{route.name}</h4>
                          <Badge className={getStyleColor(route.style)} variant="secondary">
                            {route.style}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-stone-600">
                          <span className={getDifficultyColor(route.grade)}>
                            {route.grade}
                          </span>
                          <span>{route.area}</span>
                          <span>
                            {new Date(route.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-stone-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
