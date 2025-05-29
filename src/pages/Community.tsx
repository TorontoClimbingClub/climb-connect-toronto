
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useCommunity } from "@/hooks/useCommunity";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { CommunityMember } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mountain, Phone, Users, Wrench, Calendar } from "lucide-react";

export default function Community() {
  const { members, loading } = useCommunity();
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(null);
  const [profileOverlayOpen, setProfileOverlayOpen] = useState(false);

  console.log('Community page render - members:', members, 'loading:', loading);

  const handleUserClick = (member: CommunityMember) => {
    console.log('User clicked:', member);
    setSelectedUser(member);
    setProfileOverlayOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community</h1>
            <p className="text-stone-600">Connect with fellow climbers</p>
          </div>
          <div className="text-center py-8">
            <div className="text-[#E55A2B]">Loading community members...</div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community</h1>
          <p className="text-stone-600">Connect with fellow climbers</p>
        </div>

        {!members || members.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-stone-400" />
            <p>No community members found.</p>
            <p className="text-sm">Be the first to join the climbing community!</p>
          </div>
        ) : (
          <div className="space-y-3">
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
                  className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                  onClick={() => handleUserClick(member)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#E55A2B] text-white font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-900 truncate">
                          {member.full_name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {member.phone && (
                            <div className="flex items-center gap-1 text-xs text-stone-500">
                              <Phone className="h-3 w-3" />
                              <span className="truncate">{member.phone}</span>
                            </div>
                          )}
                        </div>

                        {member.climbing_level && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Mountain className="h-3 w-3 mr-1" />
                              {member.climbing_level}
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            <span>{member.equipment_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{member.events_count || 0}</span>
                          </div>
                        </div>

                        {member.is_carpool_driver && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Driver ({member.passenger_capacity} seats)
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {member.climbing_description && (
                      <div className="mt-3 pt-3 border-t border-stone-200">
                        <p className="text-sm text-stone-600 line-clamp-2">
                          {member.climbing_description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <UserProfileOverlay
        user={selectedUser}
        open={profileOverlayOpen}
        onOpenChange={setProfileOverlayOpen}
      />

      <Navigation />
    </div>
  );
}
