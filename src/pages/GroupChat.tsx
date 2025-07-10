import { useParams, useLocation } from 'react-router-dom';
import { GroupChat as GroupChatComponent } from '@/components/chat';

export default function GroupChat() {
  const { groupId } = useParams<{ groupId: string }>();
  const location = useLocation();
  const groupName = location.state?.groupName || 'Group Chat';

  if (!groupId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Invalid group ID</div>
      </div>
    );
  }

  return <GroupChatComponent groupId={groupId} groupName={groupName} />;
}