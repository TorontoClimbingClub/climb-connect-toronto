
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
  return (
    <Card 
      className={`${isCurrentUser ? "border-orange-200 bg-orange-50" : ""} ${canViewProfile ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-[#E55A2B]">
              {member.full_name}
              {isCurrentUser && (
                <Badge variant="outline" className="ml-2 text-xs">You</Badge>
              )}
            </h3>
            {member.phone && (
              <div className="flex items-center text-sm text-stone-600 mt-1">
                <Phone className="h-3 w-3 mr-1" />
                {member.phone}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {member.is_carpool_driver && (
              <Badge variant="secondary" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Driver ({member.passenger_capacity} seats)
              </Badge>
            )}
          </div>
        </div>

        {/* Climbing Level and Experience */}
        {(member.show_climbing_level !== false) && (member.climbing_level || member.climbing_experience) && (
          <div className="mb-3 p-3 bg-stone-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Mountain className="h-4 w-4 text-[#E55A2B] mt-1 flex-shrink-0" />
                <div>
                  {member.climbing_level && (
                    <p className="text-sm font-medium text-stone-700">
                      {member.climbing_level}
                    </p>
                  )}
                  {member.climbing_experience && member.climbing_experience.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.climbing_experience.map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs bg-white">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {member.climbing_description && (
                <p className="text-sm text-stone-700 mt-1">{member.climbing_description}</p>
              )}
            </div>
          </div>
        )}

        {/* Climbing Progress - hide if user has disabled it */}
        {(member.show_climbing_progress !== false) && (
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
            {member.equipment_count} gear items
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {member.events_count} events joined
            {(member.show_completion_stats !== false) && (
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
