
import { memo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Car, Phone, Mountain, Package, Users } from "lucide-react";
import { CommunityMember } from "@/types/community";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";
import { BadgeIcon } from "@/components/badges/BadgeIcon";
import { useBadges } from "@/hooks/useBadges";
import { supabase } from "@/integrations/supabase/client";

interface CommunityMemberCardProps {
  member: CommunityMember;
  userStats: { completions: ClimbCompletion[] };
  isCurrentUser: boolean;
  canViewProfile: boolean;
  hiddenStyles: string[];
  onClick: () => void;
}

export const CommunityMemberCard = memo(function CommunityMemberCard({
  member,
  userStats,
  isCurrentUser,
  canViewProfile,
  hiddenStyles,
  onClick
}: CommunityMemberCardProps) {
  const { getUserBadges, updateUserBadges } = useBadges();
  
  // Ensure member object has all required properties with defaults
  const safeMember = {
    id: member?.id || '',
    full_name: member?.full_name || 'Unknown User',
    phone: member?.phone || null,
    is_carpool_driver: member?.is_carpool_driver || false,
    passenger_capacity: member?.passenger_capacity || 0,
    climbing_level: member?.climbing_level || null,
    climbing_experience: member?.climbing_experience || [],
    climbing_description: member?.climbing_description || null,
    equipment_count: member?.equipment_count || 0,
    events_count: member?.events_count || 0,
    profile_photo_url: member?.profile_photo_url || null,
    show_climbing_level: member?.show_climbing_level ?? true,
    show_climbing_progress: member?.show_climbing_progress ?? true,
    show_completion_stats: member?.show_completion_stats ?? true,
    show_trad_progress: member?.show_trad_progress ?? true,
    show_sport_progress: member?.show_sport_progress ?? true,
    show_top_rope_progress: member?.show_top_rope_progress ?? true,
    allow_profile_viewing: member?.allow_profile_viewing ?? true,
  };

  // Get user badges
  const userBadges = getUserBadges(safeMember.id);

  // Set up real-time subscription to update badges when this user's attendance changes
  useEffect(() => {
    const channel = supabase
      .channel(`member-badges-${safeMember.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals',
          filter: `user_id=eq.${safeMember.id}`
        },
        async (payload) => {
          console.log('🔄 [MEMBER BADGES] Attendance updated for user, refreshing badges:', safeMember.id);
          await updateUserBadges(safeMember.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [safeMember.id, updateUserBadges]);

  // Apply privacy settings consistently for all users
  const shouldShowClimbingLevel = safeMember.show_climbing_level;
  const shouldShowClimbingProgress = safeMember.show_climbing_progress;

  // Calculate hidden styles based on privacy settings
  const getPrivacyFilteredHiddenStyles = () => {
    const filtered = [...hiddenStyles];
    if (!safeMember.show_trad_progress) filtered.push('Trad');
    if (!safeMember.show_sport_progress) filtered.push('Sport');
    if (!safeMember.show_top_rope_progress) filtered.push('Top Rope');
    return filtered;
  };

  const getUserInitials = () => {
    return safeMember.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleCardClick = () => {
    if (canViewProfile) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <Card 
      className={`${isCurrentUser ? "border-orange-200 bg-orange-50" : ""} ${
        canViewProfile ? "cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#E55A2B] focus:ring-offset-2" : ""
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={canViewProfile ? 0 : -1}
      role={canViewProfile ? "button" : undefined}
      aria-label={canViewProfile ? `View ${safeMember.full_name}'s profile` : undefined}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={safeMember.profile_photo_url || undefined} />
              <AvatarFallback className="text-sm">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[#E55A2B] truncate">
                {safeMember.full_name}
                {isCurrentUser && (
                  <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                )}
              </h3>
              {safeMember.phone && (
                <div className="flex items-center text-sm text-stone-600 mt-1">
                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{safeMember.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {safeMember.is_carpool_driver && (
            <div className="flex-shrink-0 ml-2">
              <Badge variant="secondary" className="text-xs">
                <Car className="h-3 w-3 mr-1" aria-hidden="true" />
                Driver ({safeMember.passenger_capacity} seats)
              </Badge>
            </div>
          )}
        </div>

        {/* User Badges */}
        {userBadges.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {userBadges.slice(0, 3).map((userBadge) => (
                <BadgeIcon 
                  key={userBadge.id} 
                  badge={userBadge.badge} 
                  size="sm" 
                />
              ))}
              {userBadges.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{userBadges.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Climbing Level and Experience - respect privacy settings */}
        {shouldShowClimbingLevel && (safeMember.climbing_level || safeMember.climbing_experience.length > 0) && (
          <div className="mb-3 p-3 bg-stone-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Mountain className="h-4 w-4 text-[#E55A2B] mt-1 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  {safeMember.climbing_level && (
                    <p className="text-sm font-medium text-stone-700">
                      {safeMember.climbing_level}
                    </p>
                  )}
                  {safeMember.climbing_experience && safeMember.climbing_experience.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {safeMember.climbing_experience.map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs bg-white">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {safeMember.climbing_description && (
                <p className="text-sm text-stone-700 mt-1 break-words">{safeMember.climbing_description}</p>
              )}
            </div>
          </div>
        )}

        {/* Climbing Progress - respect privacy settings */}
        {shouldShowClimbingProgress && userStats?.completions && (
          <div className="mb-3">
            <CompletionProgressBars 
              completions={userStats.completions} 
              compact={true}
              areaName="Rattlesnake Point"
              hiddenStyles={getPrivacyFilteredHiddenStyles()}
            />
          </div>
        )}

        <div className="flex justify-between text-sm text-stone-600">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{safeMember.equipment_count} gear items</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
            <span>{safeMember.events_count} events joined</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
