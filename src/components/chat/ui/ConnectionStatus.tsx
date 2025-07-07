import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import {
  ConnectionStatus as ConnectionStatusType,
  ConnectionState,
  CONNECTION_STATUS_MESSAGES,
  CONNECTION_STATUS_COLORS
} from '../types/ConnectionTypes';

interface ConnectionStatusProps {
  connectionState: ConnectionState;
  onReconnect?: () => void;
  onResetAttempts?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({
  connectionState,
  onReconnect,
  onResetAttempts,
  showDetails = true,
  className = ''
}: ConnectionStatusProps) {
  const { status, isOnline, latency, reconnectAttempts, maxReconnectAttempts, error } = connectionState;

  // Get status icon
  const getStatusIcon = (status: ConnectionStatusType) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (status) {
      case 'connected':
        return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw {...iconProps} className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff {...iconProps} className="h-4 w-4 text-red-500" />;
      case 'reconnecting':
        return <RefreshCw {...iconProps} className="h-4 w-4 text-orange-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle {...iconProps} className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi {...iconProps} className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge variant based on status
  const getBadgeVariant = (status: ConnectionStatusType) => {
    switch (status) {
      case 'connected':
        return 'default';
      case 'connecting':
      case 'reconnecting':
        return 'secondary';
      case 'disconnected':
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Format latency display
  const formatLatency = (latency: number | null): string => {
    if (latency === null) return 'Unknown';
    if (latency < 0) return 'Error';
    return `${latency}ms`;
  };

  // Get connection quality indicator
  const getConnectionQuality = () => {
    if (latency === null || latency < 0) return null;
    
    if (latency <= 100) {
      return { label: 'Excellent', color: 'text-green-500', bars: 4 };
    } else if (latency <= 300) {
      return { label: 'Good', color: 'text-yellow-500', bars: 3 };
    } else if (latency <= 1000) {
      return { label: 'Fair', color: 'text-orange-500', bars: 2 };
    } else {
      return { label: 'Poor', color: 'text-red-500', bars: 1 };
    }
  };

  const quality = getConnectionQuality();

  // Compact view (just status indicator)
  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1 ${className}`}>
              {getStatusIcon(status)}
              {!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div>Status: {CONNECTION_STATUS_MESSAGES[status]}</div>
              {latency !== null && <div>Latency: {formatLatency(latency)}</div>}
              {!isOnline && <div className="text-red-500">Network offline</div>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full detailed view
  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border ${className}`}>
      {/* Status Badge */}
      <Badge variant={getBadgeVariant(status)} className="flex items-center gap-2">
        {getStatusIcon(status)}
        {CONNECTION_STATUS_MESSAGES[status]}
      </Badge>

      {/* Network Status */}
      {!isOnline && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      )}

      {/* Connection Quality */}
      {quality && status === 'connected' && (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-3 rounded-full ${
                  i < quality.bars ? quality.color.replace('text-', 'bg-') : 'bg-gray-300'
                }`}
              />
            ))}
            <span className={`text-xs ${quality.color}`}>{quality.label}</span>
          </div>
        </div>
      )}

      {/* Latency */}
      {latency !== null && status === 'connected' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-3 w-3" />
                {formatLatency(latency)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Connection latency (ping time)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Reconnection Info */}
      {(status === 'reconnecting' || status === 'failed') && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Attempt {reconnectAttempts}/{maxReconnectAttempts}
          </span>
          
          {onReconnect && (
            <Button
              size="sm"
              variant="outline"
              onClick={onReconnect}
              className="h-6 px-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          
          {onResetAttempts && reconnectAttempts > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onResetAttempts}
              className="h-6 px-2 text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="h-4 w-4 text-red-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm max-w-xs">
                {error}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Mini connection indicator for headers/status bars
export function ConnectionIndicator({
  connectionState,
  className = ''
}: {
  connectionState: ConnectionState;
  className?: string;
}) {
  const { status, isOnline } = connectionState;
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' ? 'bg-green-500' :
        status === 'connecting' || status === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
        'bg-red-500'
      }`} />
      {!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}
    </div>
  );
}

// Connection quality bars component
export function ConnectionQualityBars({
  latency,
  className = ''
}: {
  latency: number | null;
  className?: string;
}) {
  if (latency === null || latency < 0) {
    return null;
  }

  let bars = 0;
  let color = 'bg-gray-300';

  if (latency <= 100) {
    bars = 4;
    color = 'bg-green-500';
  } else if (latency <= 300) {
    bars = 3;
    color = 'bg-yellow-500';
  } else if (latency <= 1000) {
    bars = 2;
    color = 'bg-orange-500';
  } else {
    bars = 1;
    color = 'bg-red-500';
  }

  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${
            i < bars ? color : 'bg-gray-300'
          }`}
          style={{
            height: `${(i + 1) * 3 + 2}px`
          }}
        />
      ))}
    </div>
  );
}