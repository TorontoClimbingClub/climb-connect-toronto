import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Signal,
  Clock
} from 'lucide-react';
import { ConnectionStatus, ConnectionIndicator } from './ConnectionStatus';
import { useConnectionState } from '../hooks/useConnectionState';
import { MessageQueue } from '../types/ConnectionTypes';

interface ConnectionMonitorProps {
  chatType: 'community' | 'group' | 'event';
  roomId: string;
  messageQueue?: MessageQueue;
  onConnectionChange?: (isConnected: boolean) => void;
  showFullStatus?: boolean;
  className?: string;
}

export function ConnectionMonitor({
  chatType,
  roomId,
  messageQueue,
  onConnectionChange,
  showFullStatus = false,
  className = ''
}: ConnectionMonitorProps) {
  const [showReconnectProgress, setShowReconnectProgress] = useState(false);
  const [reconnectProgress, setReconnectProgress] = useState(0);

  const { connectionState, actions, isConnected, isReconnecting, connectionQuality } = useConnectionState({
    callbacks: {
      onConnected: () => {
        setShowReconnectProgress(false);
        setReconnectProgress(0);
        onConnectionChange?.(true);
      },
      onDisconnected: () => {
        onConnectionChange?.(false);
      },
      onReconnecting: (attempt) => {
        setShowReconnectProgress(true);
        // Calculate progress based on attempt number
        const progress = (attempt / connectionState.maxReconnectAttempts) * 100;
        setReconnectProgress(Math.min(progress, 90)); // Cap at 90% until connected
      },
      onReconnectFailed: () => {
        setShowReconnectProgress(false);
        setReconnectProgress(0);
      }
    },
    enabled: true
  });

  // Monitor connection changes
  useEffect(() => {
    onConnectionChange?.(isConnected);
  }, [isConnected, onConnectionChange]);

  // Show different UI based on connection state and showFullStatus prop
  if (!showFullStatus) {
    // Minimal indicator mode
    return (
      <div className={className}>
        <ConnectionIndicator connectionState={connectionState} />
      </div>
    );
  }

  // Full status display mode
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Connection Status */}
      <ConnectionStatus
        connectionState={connectionState}
        onReconnect={actions.reconnect}
        onResetAttempts={actions.resetReconnectionAttempts}
        showDetails={true}
      />

      {/* Reconnection Progress */}
      {showReconnectProgress && isReconnecting && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-sm font-medium">Reconnecting...</span>
                <span className="text-xs text-gray-500">
                  Attempt {connectionState.reconnectAttempts} of {connectionState.maxReconnectAttempts}
                </span>
              </div>
              
              <Progress value={reconnectProgress} className="h-2" />
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Next attempt in {Math.ceil(connectionState.reconnectDelay / 1000)}s</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={actions.reconnect}
                  className="h-6 px-2"
                >
                  Retry Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Issues Alert */}
      {!connectionState.isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            No network connection detected. Please check your internet connection.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Failed Alert */}
      {connectionState.status === 'failed' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Connection failed after {connectionState.reconnectAttempts} attempts.
              {connectionState.error && ` Error: ${connectionState.error}`}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                actions.resetReconnectionAttempts();
                actions.reconnect();
              }}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Poor Connection Warning */}
      {isConnected && connectionQuality === 'poor' && (
        <Alert>
          <Signal className="h-4 w-4" />
          <AlertDescription>
            Poor connection quality detected. Messages may be delayed.
            {connectionState.latency && ` Current latency: ${connectionState.latency}ms`}
          </AlertDescription>
        </Alert>
      )}

      {/* Message Queue Status */}
      {messageQueue && messageQueue.items.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            {messageQueue.isProcessing ? (
              <span>Sending {messageQueue.items.length} queued messages...</span>
            ) : (
              <span>
                {messageQueue.items.length} messages queued. 
                {!isConnected && ' Will send when connection is restored.'}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Statistics (in development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-2">Connection Debug Info</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Status: {connectionState.status}</div>
              <div>Online: {connectionState.isOnline ? 'Yes' : 'No'}</div>
              <div>Latency: {connectionState.latency || 'Unknown'}ms</div>
              <div>Quality: {connectionQuality}</div>
              <div>Attempts: {connectionState.reconnectAttempts}/{connectionState.maxReconnectAttempts}</div>
              <div>Last Connected: {connectionState.lastConnected?.toLocaleTimeString() || 'Never'}</div>
              {messageQueue && (
                <>
                  <div>Queue Size: {messageQueue.items.length}</div>
                  <div>Processed: {messageQueue.totalProcessed}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Simple connection banner for chat headers
export function ConnectionBanner({
  connectionState,
  messageQueue,
  onReconnect,
  className = ''
}: {
  connectionState: any;
  messageQueue?: MessageQueue;
  onReconnect?: () => void;
  className?: string;
}) {
  const { status, isOnline } = connectionState;

  // Don't show banner if connected and online
  if (status === 'connected' && isOnline && (!messageQueue || messageQueue.items.length === 0)) {
    return null;
  }

  const getBannerContent = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4" />,
        message: 'No network connection',
        variant: 'destructive' as const,
        showAction: false
      };
    }

    if (status === 'failed') {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'Connection failed',
        variant: 'destructive' as const,
        showAction: true
      };
    }

    if (status === 'reconnecting') {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        message: 'Reconnecting...',
        variant: 'default' as const,
        showAction: false
      };
    }

    if (status === 'connecting') {
      return {
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        message: 'Connecting...',
        variant: 'default' as const,
        showAction: false
      };
    }

    if (messageQueue && messageQueue.items.length > 0) {
      return {
        icon: <Clock className="h-4 w-4" />,
        message: `${messageQueue.items.length} messages queued`,
        variant: 'default' as const,
        showAction: false
      };
    }

    return null;
  };

  const content = getBannerContent();
  if (!content) return null;

  return (
    <Alert variant={content.variant} className={`border-l-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {content.icon}
          <AlertDescription className="mb-0">
            {content.message}
          </AlertDescription>
        </div>
        
        {content.showAction && onReconnect && (
          <Button
            size="sm"
            variant="outline"
            onClick={onReconnect}
            className="h-6 px-2"
          >
            Retry
          </Button>
        )}
      </div>
    </Alert>
  );
}