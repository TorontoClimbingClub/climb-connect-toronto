
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/events/EventCard";
import { CommunityStats } from "@/components/events/CommunityStats";
import { CommunityMemberCard } from "@/components/events/CommunityMemberCard";
import { EmptyEventsState } from "@/components/events/EmptyEventsState";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Users, Car, Phone, Mountain, Package } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useCommunity } from "@/hooks/useCommunity";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { CommunityMember } from "@/types/community";

export default function Events() {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const { members, loading: communityLoading } = useCommunity();
  const { getUserCompletionStats } = useClimbCompletions();
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);

  const handleMemberClick = (member: CommunityMember) => {
    const isCurrentUser = member.id === user?.id;
    const canViewProfile = member.allow_profile_viewing !== false || isCurrentUser;
    
    if (canViewProfile) {
      setSelectedMember(member);
      setIsProfileOverlayOpen(true);
    }
  };

  const getHiddenStyles = (member: CommunityMember, isCurrentUser: boolean) => {
    const hidden: string[] = [];
    // For the current user, respect their privacy settings
    // For other users, only hide if they've disabled it AND we're not the current user
    if (member.show_trad_progress === false) hidden.push('Trad');
    if (member.show_sport_progress === false) hidden.push('Sport');
    if (member.show_top_rope_progress === false) hidden.push('Top Rope');
    return hidden;
  };

  if (eventsLoading || communityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E55A2B] mb-2">Toronto Climbing Community</h1>
          <p className="text-stone-600">Connect with fellow climbers and join upcoming events</p>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {events.length === 0 ? (
              <EmptyEventsState />
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityStats members={members} />
            
            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member) => {
                const isCurrentUser = member.id === user?.id;
                const canViewProfile = member.allow_profile_viewing !== false || isCurrentUser;
                const userStats = getUserCompletionStats(member.id);
                const hiddenStyles = getHiddenStyles(member, isCurrentUser);

                return (
                  <CommunityMemberCard
                    key={member.id}
                    member={member}
                    userStats={userStats}
                    isCurrentUser={isCurrentUser}
                    canViewProfile={canViewProfile}
                    hiddenStyles={hiddenStyles}
                    onClick={() => handleMemberClick(member)}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
      
      <UserProfileOverlay
        user={selectedMember}
        open={isProfileOverlayOpen}
        onOpenChange={setIsProfileOverlayOpen}
      />
    </div>
  );
}
