
import { EnhancedRealtimeChat } from '@/components/enhanced-realtime-chat';
import { useAuth } from '@/hooks/useAuth';

export default function Chat() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500 py-8">
          <p>Please sign in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <EnhancedRealtimeChat
        roomName="community-chat"
        username={user.user_metadata?.display_name || user.email || 'Anonymous'}
        onMessage={(message) => {
          console.log('New message received:', message);
        }}
      />
    </div>
  );
}
