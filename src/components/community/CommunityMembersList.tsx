
import { CommunityMember } from "@/types/community";
import { CommunityMemberCard } from "@/components/events/CommunityMemberCard";
import { Card, CardContent } from "@/components/ui/card";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";

interface CommunityMembersListProps {
  members: CommunityMember[];
  onMemberClick: (member: CommunityMember) => void;
}

export function CommunityMembersList({ members, onMemberClick }: CommunityMembersListProps) {
  const { getUserCompletionStats } = useClimbCompletions();
  const { user } = useAuth();

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-stone-600">No members found matching your search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const userStats = getUserCompletionStats(member.id);
        const isCurrentUser = user?.id === member.id;
        const canViewProfile = member.allow_profile_viewing !== false;

        return (
          <CommunityMemberCard
            key={member.id}
            member={member}
            userStats={userStats}
            isCurrentUser={isCurrentUser}
            canViewProfile={canViewProfile}
            hiddenStyles={[]}
            onClick={() => onMemberClick(member)}
          />
        );
      })}
    </div>
  );
}
