
import { EnhancedRealtimeChat } from '@/components/enhanced-realtime-chat';
import { useAuth } from '@/hooks/useAuth';

export default function Chat() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-gray-500 py-8">
          <p>Please sign in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <EnhancedRealtimeChat
        roomName="community-chat"
        username={user.user_metadata?.display_name || user.email || 'Anonymous'}
        onMessage={(message) => {
          console.log('New message received:', message);
          // Could add notifications here
          if (message.mentioned_users?.includes(user.id)) {
            console.log('You were mentioned!');
          }
        }}
      />
    </div>
  );
}
