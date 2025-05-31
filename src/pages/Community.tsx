import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Phone, Mountain, Users } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { members, loading } = useCommunity();
  const { getUserCompletionStats } = useClimbCompletions();
  const { containerClass, paddingClass } = useResponsiveContainer('medium');

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.climbing_level && member.climbing_level.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.climbing_experience && member.climbing_experience.some(exp => 
      exp.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleMemberClick = (member: any) => {
    setSelectedUser(member);
    setIsProfileOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center pb-20">
        <div className="text-[#E55A2B]">Loading community members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-[#E55A2B]" />
            <h1 className="text-2xl font-bold text-[#E55A2B]">Community</h1>
          </div>
          <p className="text-stone-600">Connect with fellow climbers</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search members by name, level, or experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-stone-600">No members found matching your search.</p>
              </CardContent>
            </Card>
          ) : (
            filteredMembers.map((member) => {
              const userInitials = member.full_name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const userStats = getUserCompletionStats(member.id);

              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow cursor-pointer member-card" onClick={() => handleMemberClick(member)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#E55A2B] text-white font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{member.full_name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.climbing_level && (
                            <Badge variant="outline" className="text-xs">
                              {member.climbing_level}
                            </Badge>
                          )}
                          {member.climbing_experience && member.climbing_experience.slice(0, 2).map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                          {member.climbing_experience && member.climbing_experience.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.climbing_experience.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Climbing Progress Indicators */}
                    <div className="mb-3">
                      <CompletionProgressBars 
                        completions={userStats.completions} 
                        compact={true}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {member.phone && (
                          <div className="flex items-center gap-1 text-stone-600">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{member.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-stone-600">
                          <Mountain className="h-3 w-3" />
                          <span className="text-xs">{userStats.total} routes</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#E55A2B] hover:bg-orange-50 h-6 px-2 text-xs">
                        View Profile
                      </Button>
                    </div>

                    {member.climbing_description && (
                      <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                        {member.climbing_description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <UserProfileOverlay
        user={selectedUser}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      <Navigation />
    </div>
  );
}
