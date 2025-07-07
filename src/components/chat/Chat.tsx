import React from 'react';
import { ChatProvider } from './ChatProvider';
import { ChatContainer, ChatHeader, MessageList, MessageInput, SearchBar, LoadingSpinner } from './ui';
import { useChatContext } from './ChatContext';
import { ChatConfig, ChatType, CHAT_CONFIGS } from './types';

interface ChatProps {
  chatType: ChatType;
  roomId: string;
  roomName: string;
  config?: Partial<ChatConfig>;
  onBack?: () => void;
  onMessage?: (message: any) => void;
  className?: string;
  actionSlot?: React.ReactNode;
}

// Internal Chat component that uses the context
function ChatInternal({
  onBack,
  actionSlot,
  className = ''
}: {
  onBack?: () => void;
  actionSlot?: React.ReactNode;
  className?: string;
}) {
  const { config, roomName, state, actions, utils } = useChatContext();

  if (state.isLoading) {
    return <LoadingSpinner message={`Loading ${config.type} chat...`} className={className} />;
  }

  const subtitle = `${state.messages.length} message${state.messages.length !== 1 ? 's' : ''}`;

  return (
    <ChatContainer className={className}>
      <ChatHeader
        title={roomName}
        subtitle={subtitle}
        showBackButton={!!onBack}
        onBack={onBack}
        actions={
          config.features.search ? (
            <SearchBar
              searchTerm={state.searchTerm}
              onSearchChange={actions.setSearchTerm}
              showSearch={state.showSearch}
              onToggleSearch={actions.toggleSearch}
            />
          ) : undefined
        }
      />
      
      <MessageList
        messages={state.messages}
        isLoading={state.isLoading}
        canDelete={utils.canDeleteMessage}
        onDeleteMessage={actions.deleteMessage}
        formatTimestamp={utils.formatTimestamp}
      />
      
      <MessageInput
        value={state.newMessage}
        onChange={actions.setNewMessage}
        onSend={actions.sendMessage}
        placeholder={`Message ${roomName}...`}
        actionSlot={actionSlot}
      />
    </ChatContainer>
  );
}

// Main Chat component with provider
export function Chat({
  chatType,
  roomId,
  roomName,
  config: customConfig = {},
  onBack,
  onMessage,
  className,
  actionSlot
}: ChatProps) {
  // Merge default config with custom config
  const baseConfig = CHAT_CONFIGS[chatType];
  const config: ChatConfig = {
    ...baseConfig,
    ...customConfig,
    features: {
      ...baseConfig.features,
      ...customConfig.features
    },
    permissions: {
      ...baseConfig.permissions,
      ...customConfig.permissions
    },
    realtime: {
      ...baseConfig.realtime,
      ...customConfig.realtime
    }
  } as ChatConfig;

  return (
    <ChatProvider
      config={config}
      roomId={roomId}
      roomName={roomName}
      onMessage={onMessage}
    >
      <ChatInternal
        onBack={onBack}
        actionSlot={actionSlot}
        className={className}
      />
    </ChatProvider>
  );
}

// Pre-configured chat components for convenience
export function CommunityChat(props: Omit<ChatProps, 'chatType'>) {
  return <Chat {...props} chatType="community" />;
}

export function GroupChat(props: Omit<ChatProps, 'chatType'>) {
  return <Chat {...props} chatType="group" />;
}

export function EventChat(props: Omit<ChatProps, 'chatType'>) {
  return <Chat {...props} chatType="event" />;
}