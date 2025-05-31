
import { useEffect, useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/events/EventCard";
import { EmptyEventsState } from "@/components/events/EmptyEventsState";
import { CommunityMemberCard } from "@/components/events/CommunityMemberCard";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { useEventManager } from "@/hooks/useEventManager";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useCommunityData } from "@/hooks/useCommunityData";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";
import { CommunityMember } from "@/types/community";

export default function Events() {
  const { user } = useAuth();
  const { hasAccess, accessLoading } = useAccessControl('authenticated');
  const { containerClass, paddingClass } = useResponsiveContainer('medium');

  const {
    upcomingEvents,
    userParticipations,
    loading: eventsLoading,
    fetchUserParticipations
  } = useEventManager();
  
  const {
    members,
    loading: membersLoading,
    fetchCommunityMembers
  } = useCommunityData();
  
  const {
    getUserCompletionStats,
    loading: completionsLoading
  } = useClimbCompletions();
  
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(null);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);

  // Enable real-time updates for events
  useRealtimeEvents();
  
  const handleMemberClick = useCallback((member: CommunityMember) => {
    console.log('📱 Events: Member clicked:', member.full_name);
    setSelectedUser(member);
    setShowProfileOverlay(true);
  }, []);
  
  const handleCloseProfile = useCallback(() => {
    setShowProfileOverlay(false);
    setSelectedUser(null);
  }, []);

  // Fetch user participations when user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserParticipations(user.id);
    }
  }, [user?.id, fetchUserParticipations]);

  // Fetch community members on mount
  useEffect(() => {
    fetchCommunityMembers();
  }, [fetchCommunityMembers]);
  
  const loading = accessLoading || eventsLoading;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className={`${containerClass} ${paddingClass}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B] mx-auto mb-4" aria-hidden="true"></div>
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
        <div className={`${containerClass} ${paddingClass}`}>
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
      <div className={`${containerClass} ${paddingClass}`}>
        <main>
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4" role="list">
                {upcomingEvents.map(event => (
                  <div key={event.id} role="listitem">
                    <EventCard event={event} userJoined={userParticipations.has(event.id)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyEventsState />
            )}
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Members</h2>
            {membersLoading || completionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E55A2B]" aria-hidden="true"></div>
                <span className="ml-2 text-gray-600">Loading members...</span>
              </div>
            ) : members.length > 0 ? (
              <div className="space-y-4" role="list">
                {members.map(member => {
                  const userStats = getUserCompletionStats(member.id);
                  return (
                    <div key={member.id} role="listitem">
                      <CommunityMemberCard 
                        member={member} 
                        userStats={userStats} 
                        isCurrentUser={user?.id === member.id} 
                        canViewProfile={member.allow_profile_viewing ?? true} 
                        hiddenStyles={[]} 
                        onClick={() => handleMemberClick(member)} 
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No community members found.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      <UserProfileOverlay user={selectedUser} open={showProfileOverlay} onOpenChange={handleCloseProfile} />

      <Navigation />
    </div>
  );
}
