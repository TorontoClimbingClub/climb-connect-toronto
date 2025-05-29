
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Phone, Mountain, Package, Users } from "lucide-react";
import { CommunityMember } from "@/types/community";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";

interface CommunityMemberCardProps {
  member: CommunityMember;
  userStats: { completions: ClimbCompletion[] };
  isCurrentUser: boolean;
  canViewProfile: boolean;
  hiddenStyles: string[];
  onClick: () => void;
}

export function CommunityMemberCard({
  member,
  userStats,
  isCurrentUser,
  canViewProfile,
  hiddenStyles,
  onClick
}: CommunityMemberCardProps) {
  // Ensure member object has all required properties with defaults
  const safeMemeber = {
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
    show_climbing_level: member?.show_climbing_level !== false,
    show_climbing_progress: member?.show_climbing_progress !== false,
    show_completion_stats: member?.show_completion_stats !== false,
    show_trad_progress: member?.show_trad_progress !== false,
    show_sport_progress: member?.show_sport_progress !== false,
    show_top_rope_progress: member?.show_top_rope_progress !== false,
    allow_profile_viewing: member?.allow_profile_viewing !== false,
  };

  // For privacy settings, hide from everyone (including the user) if they've disabled it
  const shouldShowClimbingLevel = safeMemeber.show_climbing_level;
  const shouldShowClimbingProgress = safeMemeber.show_climbing_progress;
  const shouldShowCompletionStats = safeMemeber.show_completion_stats;

  return (
    <Card 
      className={`${isCurrentUser ? "border-orange-200 bg-orange-50" : ""} ${canViewProfile ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-[#E55A2B]">
              {safeMemeber.full_name}
              {isCurrentUser && (
                <Badge variant="outline" className="ml-2 text-xs">You</Badge>
              )}
            </h3>
            {safeMemeber.phone && (
              <div className="flex items-center text-sm text-stone-600 mt-1">
                <Phone className="h-3 w-3 mr-1" />
                {safeMemeber.phone}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {safeMemeber.is_carpool_driver && (
              <Badge variant="secondary" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Driver ({safeMemeber.passenger_capacity} seats)
              </Badge>
            )}
          </div>
        </div>

        {/* Climbing Level and Experience */}
        {shouldShowClimbingLevel && (safeMemeber.climbing_level || safeMemeber.climbing_experience.length > 0) && (
          <div className="mb-3 p-3 bg-stone-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Mountain className="h-4 w-4 text-[#E55A2B] mt-1 flex-shrink-0" />
                <div>
                  {safeMemeber.climbing_level && (
                    <p className="text-sm font-medium text-stone-700">
                      {safeMemeber.climbing_level}
                    </p>
                  )}
                  {safeMemeber.climbing_experience && safeMemeber.climbing_experience.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {safeMemeber.climbing_experience.map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs bg-white">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {safeMemeber.climbing_description && (
                <p className="text-sm text-stone-700 mt-1">{safeMemeber.climbing_description}</p>
              )}
            </div>
          </div>
        )}

        {/* Climbing Progress */}
        {shouldShowClimbingProgress && userStats?.completions && (
          <div className="mb-3">
            <CompletionProgressBars 
              completions={userStats.completions} 
              compact={true}
              areaName="Rattlesnake Point"
              hiddenStyles={hiddenStyles}
            />
          </div>
        )}

        <div className="flex justify-between text-sm text-stone-600">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-1" />
            {safeMemeber.equipment_count} gear items
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {safeMemeber.events_count} events joined
            {shouldShowCompletionStats && userStats?.completions && (
              <>
                <span className="mx-2">•</span>
                {userStats.completions.length} routes
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
