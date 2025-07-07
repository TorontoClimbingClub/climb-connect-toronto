import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Settings, 
  RotateCcw,
  Trash2,
  Activity
} from 'lucide-react';

import { useEnhancedChat } from './hooks/useEnhancedChat';
import { 
  ConnectionMonitor, 
  ConnectionBanner,
  ConnectionIndicator 
} from './ui/ConnectionMonitor';
import { ConnectionStatus } from './ui/ConnectionStatus';

interface EnhancedChatDemoProps {
  chatType: 'community' | 'group' | 'event';
  roomId: string;
  roomName: string;
  className?: string;
}

export function EnhancedChatDemo({
  chatType,
  roomId,
  roomName,
  className = ''
}: EnhancedChatDemoProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);

  const {
    // Messages
    messages,
    isLoading,
    
    // Connection state
    connectionState,
    isConnected,
    connectionQuality,
    
    // Message queue
    messageQueue,
    queueSize,
    isProcessingQueue,
    
    // Actions
    sendMessage,
    loadMessages,
    retryMessage,
    clearQueue,
    reconnect,
    resetConnection,
    
    // Fallback mode
    isFallbackMode,
    lastSuccessfulConnection,
    
    // Error handling
    error,
    clearError
  } = useEnhancedChat({
    chatType,
    roomId,
    roomName,
    config: {
      // Custom configuration for demo
      initialReconnectDelay: 2000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 15000,
      enableMessageQueue: true,
      maxQueueSize: 50
    }
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Banner */}
      <ConnectionBanner
        connectionState={connectionState}
        messageQueue={messageQueue}
        onReconnect={reconnect}
      />

      {/* Chat Header with Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">{roomName}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {chatType}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Connection Indicator */}
              <ConnectionIndicator connectionState={connectionState} />
              
              {/* Fallback Mode Badge */}
              {isFallbackMode && (
                <Badge variant="secondary" className="text-xs">
                  Fallback Mode
                </Badge>
              )}
              
              {/* Queue Status */}
              {queueSize > 0 && (
                <Badge variant="outline" className="text-xs">
                  {queueSize} queued
                </Badge>
              )}
              
              {/* Connection Details Toggle */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowConnectionDetails(!showConnectionDetails)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showConnectionDetails && (
            <div className="pt-3">
              <ConnectionStatus
                connectionState={connectionState}
                onReconnect={reconnect}
                onResetAttempts={resetConnection}
                showDetails={true}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Connection Monitor */}
          <ConnectionMonitor
            chatType={chatType}
            roomId={roomId}
            messageQueue={messageQueue}
            showFullStatus={false}
          />

          {/* Messages Display */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-500">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-500">No messages yet</div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.profiles?.display_name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">{message.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder={
                isConnected 
                  ? "Type a message..." 
                  : "Type a message (will be queued)..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessingQueue}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isProcessingQueue}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Control Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadMessages}
              disabled={isLoading}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={reconnect}
              disabled={isConnected}
            >
              <Activity className="h-3 w-3 mr-1" />
              Reconnect
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={resetConnection}
            >
              Reset
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={clearQueue}
              disabled={queueSize === 0}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear Queue
            </Button>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Connection</div>
              <div className={`${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Quality</div>
              <div className={`${
                connectionQuality === 'good' ? 'text-green-600' :
                connectionQuality === 'poor' ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {connectionQuality}
              </div>
            </div>
            
            <div>
              <div className="font-medium">Messages</div>
              <div className="text-gray-600">{messages.length}</div>
            </div>
            
            <div>
              <div className="font-medium">Queue</div>
              <div className="text-gray-600">
                {queueSize} / {messageQueue?.totalQueued || 0}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-red-800">{error}</div>
                <Button size="sm" variant="ghost" onClick={clearError}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Debug Information (Development Mode) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs">
              <summary className="cursor-pointer font-medium">Debug Info</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify({
                  connectionState: {
                    status: connectionState.status,
                    isOnline: connectionState.isOnline,
                    latency: connectionState.latency,
                    reconnectAttempts: connectionState.reconnectAttempts
                  },
                  messageQueue: {
                    size: queueSize,
                    isProcessing: isProcessingQueue,
                    totalQueued: messageQueue?.totalQueued,
                    totalProcessed: messageQueue?.totalProcessed,
                    totalFailed: messageQueue?.totalFailed
                  },
                  isFallbackMode,
                  lastSuccessfulConnection: lastSuccessfulConnection?.toISOString()
                }, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}