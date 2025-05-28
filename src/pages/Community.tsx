
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mountain, Phone, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { useCommunity } from "@/hooks/useCommunity";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { CommunityMember } from "@/types/community";

export default function Community() {
  const { members, loading } = useCommunity();
  const { getUserCompletionStats } = useClimbCompletions();
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleUserClick = (user: CommunityMember) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Members</h1>
          <p className="text-stone-600">Connect with fellow climbers in the TCC community</p>
        </div>

        <div className="space-y-4">
          {members.map((member) => {
            const userStats = getUserCompletionStats(member.id);
            const userInitials = member.full_name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card 
                key={member.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleUserClick(member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="bg-[#E55A2B] text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="font-semibold text-lg text-stone-800">
                          {member.full_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-stone-600 mt-1">
                          {member.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Climbing Info */}
                      {(member.climbing_level || member.climbing_experience) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mountain className="h-4 w-4 text-[#E55A2B]" />
                            <span className="text-sm font-medium">Climbing Info</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {member.climbing_level && (
                              <Badge variant="outline">{member.climbing_level}</Badge>
                            )}
                            {member.climbing_experience && member.climbing_experience.length > 0 && (
                              member.climbing_experience.map((exp) => (
                                <Badge key={exp} variant="secondary" className="text-xs">
                                  {exp}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Progress */}
                      <div className="space-y-2">
                        <CompletionProgressBars 
                          completions={userStats.completions} 
                          compact={true}
                          areaName="Rattlesnake Point"
                        />
                      </div>

                      {/* Description */}
                      {member.climbing_description && (
                        <p className="text-sm text-stone-700 bg-stone-50 p-2 rounded">
                          {member.climbing_description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Navigation />

      <UserProfileOverlay
        user={selectedUser}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </div>
  );
}
