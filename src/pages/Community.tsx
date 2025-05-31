
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useCommunityWithMonitoring } from "@/hooks/useCommunityWithMonitoring";
import { UserProfileOverlay } from "@/components/UserProfileOverlay";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";
import { CommunityErrorBoundary } from "@/components/community/CommunityErrorBoundary";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunitySearch } from "@/components/community/CommunitySearch";
import { CommunityMembersList } from "@/components/community/CommunityMembersList";
import { CommunityLoadingState } from "@/components/community/CommunityLoadingState";
import { CommunityErrorDisplay } from "@/components/community/CommunityErrorDisplay";
import { CommunityMember } from "@/types/community";

function CommunityContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { 
    members, 
    loading, 
    error, 
    refreshMembers, 
    retryFetch, 
    resetError,
    performanceMetrics 
  } = useCommunityWithMonitoring();
  const { containerClass, paddingClass } = useResponsiveContainer('medium');

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.climbing_level && member.climbing_level.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.climbing_experience && member.climbing_experience.some(exp => 
      exp.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleMemberClick = (member: CommunityMember) => {
    setSelectedUser(member);
    setIsProfileOpen(true);
  };

  const handleRetry = () => {
    console.log('🔄 Community page retry requested');
    resetError();
    retryFetch();
  };

  console.log('🏠 Community Page Render:', {
    memberCount: members.length,
    filteredCount: filteredMembers.length,
    loading,
    error: !!error,
    searchTerm,
    performanceMetrics
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <CommunityHeader 
          memberCount={members.length} 
          isLoading={loading} 
        />

        <CommunitySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading && <CommunityLoadingState />}
        
        {error && !loading && (
          <CommunityErrorDisplay
            error={error}
            onRetry={handleRetry}
            onResetError={resetError}
            retryCount={performanceMetrics.retryCount}
          />
        )}

        {!loading && !error && (
          <CommunityMembersList 
            members={filteredMembers}
            onMemberClick={handleMemberClick}
          />
        )}
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

export default function Community() {
  return (
    <CommunityErrorBoundary onRetry={() => window.location.reload()}>
      <CommunityContent />
    </CommunityErrorBoundary>
  );
}
