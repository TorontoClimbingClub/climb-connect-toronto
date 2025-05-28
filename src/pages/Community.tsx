
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mountain, Wrench, Calendar, Phone } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { useCommunity } from "@/hooks/useCommunity";
import { CommunityMember } from "@/types/community";

export default function Community() {
  const { members, loading } = useCommunity();
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(null);
  const [showUserOverlay, setShowUserOverlay] = useState(false);

  const handleUserClick = (user: CommunityMember) => {
    setSelectedUser(user);
    setShowUserOverlay(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading community members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-[#E55A2B]" />
            <h1 className="text-2xl font-bold text-[#E55A2B]">Community</h1>
          </div>
          <p className="text-stone-600">Connect with fellow climbers in our community</p>
        </div>

        {/* Community Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Community Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#E55A2B]">{members.length}</div>
                <div className="text-sm text-stone-600">Total Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#E55A2B]">
                  {members.filter(m => m.climbing_level && m.climbing_level !== 'Never Climbed').length}
                </div>
                <div className="text-sm text-stone-600">Active Climbers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="space-y-4">
          {members.map((member) => {
            const userInitials = member.full_name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card 
                key={member.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleUserClick(member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[#E55A2B] text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[#E55A2B]">{member.full_name}</h3>
                        {member.climbing_level && (
                          <Badge variant="outline" className="text-xs">
                            {member.climbing_level}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-stone-600">
                        {member.equipment_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            <span>{member.equipment_count} gear</span>
                          </div>
                        )}
                        
                        {member.events_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{member.events_count} events</span>
                          </div>
                        )}
                        
                        {member.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      
                      {member.climbing_experience && member.climbing_experience.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.climbing_experience.slice(0, 3).map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {member.climbing_experience.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.climbing_experience.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <UserProfileOverlay
        user={selectedUser}
        open={showUserOverlay}
        onOpenChange={setShowUserOverlay}
      />

      <Navigation />
    </div>
  );
}
