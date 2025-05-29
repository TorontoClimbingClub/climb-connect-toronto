import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEventActions } from "@/hooks/useEventActions";
import { Navigation } from "@/components/Navigation";
import { useEvents } from "@/hooks/useEvents";
import { useCommunity } from "@/hooks/useCommunity";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { CommunityMember } from "@/types/community";
import { EventCard } from "@/components/events/EventCard";
import { CommunityMemberCard } from "@/components/events/CommunityMemberCard";
import { EmptyEventsState } from "@/components/events/EmptyEventsState";

export default function Events() {
  const { upcomingEvents, userParticipations, loading: eventsLoading, fetchEvents, fetchUserParticipations, updateUserParticipation } = useEvents();
  const { members, loading: communityLoading } = useCommunity();
  const { completions, getUserCompletionStats } = useClimbCompletions();
  const { user } = useAuth();
  const { toast } = useToast();
  const { joinEvent, loading: actionLoading } = useEventActions();
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [profileOverlayOpen, setProfileOverlayOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserParticipations(user.id);
    }
  }, [user, fetchUserParticipations]);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join events",
        variant: "destructive",
      });
      return;
    }

    const result = await joinEvent(eventId, user.id);
    if (result.success) {
      updateUserParticipation(eventId, true);
      fetchEvents();
    }
  };

  const handleMemberClick = (member: CommunityMember) => {
    if (member.id === user?.id || member.allow_profile_viewing !== false) {
      setSelectedMember(member);
      setProfileOverlayOpen(true);
    }
  };

  const getHiddenStyles = (member: CommunityMember) => {
    if (!member) return [];
    
    const hidden: string[] = [];
    // Hide styles for everyone if the member has disabled them
    if (member.show_trad_progress === false) hidden.push('Trad');
    if (member.show_sport_progress === false) hidden.push('Sport');
    if (member.show_top_rope_progress === false) hidden.push('Top Rope');
    return hidden;
  };

  if (eventsLoading || communityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community & Events</h1>
          <p className="text-stone-600">Join climbing events and connect with fellow climbers</p>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#E55A2B] mb-4">Upcoming Events</h2>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showJoinButton={!!user}
                  userJoined={userParticipations.has(event.id)}
                  onJoin={() => handleJoinEvent(event.id)}
                  isLoading={actionLoading}
                />
              ))}
            </div>
          ) : (
            <EmptyEventsState />
          )}
        </div>

        {/* Community Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#E55A2B] mb-4">Members</h2>

          <div className="space-y-4">
            {members && members.map((member) => {
              if (!member || !member.id) return null;
              
              const userStats = getUserCompletionStats(member.id);
              const hiddenStyles = getHiddenStyles(member);
              const isCurrentUser = member.id === user?.id;
              const canViewProfile = isCurrentUser || member.allow_profile_viewing !== false;
              
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
        </div>
      </div>

      <UserProfileOverlay
        user={selectedMember}
        open={profileOverlayOpen}
        onOpenChange={setProfileOverlayOpen}
      />

      <Navigation />
    </div>
  );
}
