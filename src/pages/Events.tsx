
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/events/EventCard";
import { EmptyEventsState } from "@/components/events/EmptyEventsState";
import { CommunityMemberCard } from "@/components/events/CommunityMemberCard";
import { CommunityStats } from "@/components/events/CommunityStats";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedEvents } from "@/hooks/useOptimizedEvents";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useCommunityData } from "@/hooks/useCommunityData";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";

export default function Events() {
  const { user } = useAuth();
  const { hasAccess, accessLoading } = useAccessControl('authenticated');
  const { upcomingEvents, userParticipations, loading, fetchUserParticipations } = useOptimizedEvents();
  const { members, loading: membersLoading, fetchCommunityMembers } = useCommunityData();
  const { getUserCompletionStats } = useClimbCompletions();

  // Enable real-time updates for events
  useRealtimeEvents();

  useEffect(() => {
    if (user) {
      fetchUserParticipations(user.id);
    }
  }, [user, fetchUserParticipations]);

  useEffect(() => {
    fetchCommunityMembers();
  }, [fetchCommunityMembers]);

  if (accessLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-4">Access Required</h1>
            <p className="text-gray-600 mb-4">Please log in to view events.</p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <CommunityStats
          memberCount={members.length}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userJoined={userParticipations.has(event.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyEventsState />
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Community Spotlight
          </h2>
          <div className="space-y-4">
            {members.slice(0, 3).map((member) => {
              const userStats = getUserCompletionStats(member.id);
              return (
                <CommunityMemberCard 
                  key={member.id} 
                  member={member}
                  userStats={userStats}
                  isCurrentUser={user?.id === member.id}
                  canViewProfile={true}
                  hiddenStyles={[]}
                  onClick={() => {}}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
