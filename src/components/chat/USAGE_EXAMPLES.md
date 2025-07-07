# Chat System Usage Examples

## Basic Usage

### Simple Community Chat
```tsx
import { CommunityChat } from '@/components/chat';

function CommunityPage() {
  return (
    <CommunityChat
      roomId="community"
      roomName="Community Chat"
    />
  );
}
```

### Group Chat with Event Creation
```tsx
import { GroupChat } from '@/components/chat';
import { ChatActionsMenu } from '@/components/chat-actions-menu';

function GroupChatPage() {
  const { groupId } = useParams();
  const groupName = "Climbing Group";

  return (
    <GroupChat
      roomId={groupId}
      roomName={groupName}
      onBack={() => navigate('/groups')}
      actionSlot={
        <ChatActionsMenu 
          onCreateEvent={() => setIsEventModalOpen(true)}
        />
      }
    />
  );
}
```

### Event Chat with Participant Check
```tsx
import { EventChat } from '@/components/chat';

function EventChatPage() {
  const { eventId } = useParams();
  const [isParticipant, setIsParticipant] = useState(false);

  if (!isParticipant) {
    return <NotParticipantView />;
  }

  return (
    <EventChat
      roomId={eventId}
      roomName="Event Chat"
      onBack={() => navigate('/events')}
    />
  );
}
```

## Advanced Configuration

### Custom Chat Features
```tsx
import { Chat } from '@/components/chat';

function CustomChat() {
  const customConfig = {
    features: {
      search: true,
      adminDelete: true,
      readStatus: true,
      eventCreation: false,
      reactions: true,  // Future feature
      typing: true,     // Future feature
      messageEdit: false
    }
  };

  return (
    <Chat
      chatType="group"
      roomId="special-group"
      roomName="Special Group"
      config={customConfig}
    />
  );
}
```

### With Custom Permissions
```tsx
import { Chat } from '@/components/chat';

function ModeratedChat() {
  const config = {
    permissions: {
      canDelete: (userId, messageUserId, isAdmin) => {
        // Custom permission logic
        return isAdmin || userId === messageUserId;
      },
      canCreateEvents: true,
      canEditMessages: false,
      canUploadFiles: true,
      canSendVoice: false
    }
  };

  return (
    <Chat
      chatType="group"
      roomId="moderated-group"
      roomName="Moderated Chat"
      config={config}
    />
  );
}
```

## Using Chat Context

### Accessing Chat State
```tsx
import { useChatState, useChatActions } from '@/components/chat';

function ChatStats() {
  const { messages, isLoading, searchTerm } = useChatState();
  const { toggleSearch } = useChatActions();

  return (
    <div>
      <p>Messages: {messages.length}</p>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      {searchTerm && <p>Searching: {searchTerm}</p>}
      <button onClick={toggleSearch}>Toggle Search</button>
    </div>
  );
}
```

### Custom Message Actions
```tsx
import { useChatContext } from '@/components/chat';

function CustomMessageActions({ messageId }: { messageId: string }) {
  const { actions, utils, permissions } = useChatContext();

  const handleCustomAction = async () => {
    // Custom logic here
    await actions.deleteMessage(messageId);
  };

  if (!permissions.canDeleteAnyMessage) {
    return null;
  }

  return (
    <button onClick={handleCustomAction}>
      Custom Action
    </button>
  );
}
```

## Working with Services

### Custom Message Service
```tsx
import { MessageService } from '@/components/chat';

// In a custom hook or component
const loadCustomMessages = async () => {
  try {
    const messages = await MessageService.searchMessages(
      'group',
      'room-id',
      'search term',
      {
        user_id: 'specific-user',
        date_range: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      }
    );
    console.log('Search results:', messages);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Custom Realtime Subscription
```tsx
import { RealtimeService } from '@/components/chat';

const useCustomRealtime = (chatType, roomId) => {
  useEffect(() => {
    const cleanup = RealtimeService.subscribe(
      chatType,
      roomId,
      (message) => {
        console.log('New message:', message);
        // Custom handling
      }
    );

    return cleanup;
  }, [chatType, roomId]);
};
```

## Migration Examples

### From Old Group Chat
```tsx
// OLD WAY
import { GroupChat as OldGroupChat } from '@/components/group-chat';

function OldGroupChatPage() {
  const { groupId } = useParams();
  return <OldGroupChat groupId={groupId} groupName="Group Name" />;
}

// NEW WAY
import { GroupChat } from '@/components/chat';

function NewGroupChatPage() {
  const { groupId } = useParams();
  
  return (
    <GroupChat
      roomId={groupId}
      roomName="Group Name"
      onBack={() => navigate('/groups')}
    />
  );
}
```

### From Old Enhanced Realtime Chat
```tsx
// OLD WAY
import { EnhancedRealtimeChat } from '@/components/enhanced-realtime-chat';

function OldCommunityPage() {
  return (
    <EnhancedRealtimeChat
      roomName="community"
      username="user"
      onMessage={(msg) => console.log(msg)}
    />
  );
}

// NEW WAY
import { CommunityChat } from '@/components/chat';

function NewCommunityPage() {
  return (
    <CommunityChat
      roomId="community"
      roomName="Community Chat"
      onMessage={(msg) => console.log(msg)}
    />
  );
}
```

## Future Features

### With Reactions (When Available)
```tsx
import { Chat } from '@/components/chat';

function ChatWithReactions() {
  const config = {
    features: {
      reactions: true,
      typing: true,
      messageEdit: true
    }
  };

  return (
    <Chat
      chatType="group"
      roomId="group-id"
      roomName="Group Name"
      config={config}
    />
  );
}
```

### With Interactive Messages
```tsx
import { Chat } from '@/components/chat';

function InteractiveChat() {
  const config = {
    features: {
      interactiveMessages: true,
      eventCreation: true
    }
  };

  const handleMessage = (message) => {
    if (message.type === 'event_created') {
      // Handle event creation message
      console.log('Event created:', message.metadata.event_data);
    }
  };

  return (
    <Chat
      chatType="group"
      roomId="group-id"
      roomName="Group Name"
      config={config}
      onMessage={handleMessage}
    />
  );
}
```

## Testing

### Mock Services
```tsx
import { Chat } from '@/components/chat';

function TestChat() {
  const mockServices = {
    messageService: {
      loadMessages: jest.fn(),
      sendMessage: jest.fn(),
      deleteMessage: jest.fn()
    }
  };

  return (
    <Chat
      chatType="community"
      roomId="test-room"
      roomName="Test Chat"
      services={mockServices}
    />
  );
}
```