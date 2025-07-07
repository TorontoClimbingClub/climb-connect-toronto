import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  ConnectionStatus,
  ConnectionState,
  ConnectionConfig,
  ConnectionCallbacks,
  ConnectionActions,
  DEFAULT_CONNECTION_CONFIG
} from '../types/ConnectionTypes';

export interface UseConnectionStateOptions {
  config?: Partial<ConnectionConfig>;
  callbacks?: ConnectionCallbacks;
  enabled?: boolean;
}

export interface UseConnectionStateReturn {
  connectionState: ConnectionState;
  actions: ConnectionActions;
  isConnected: boolean;
  isReconnecting: boolean;
  connectionQuality: 'good' | 'poor' | 'unknown';
}

export function useConnectionState({
  config: userConfig = {},
  callbacks = {},
  enabled = true
}: UseConnectionStateOptions = {}): UseConnectionStateReturn {
  const config = { ...DEFAULT_CONNECTION_CONFIG, ...userConfig };
  
  // Connection state
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    lastConnected: null,
    lastDisconnected: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: config.maxReconnectAttempts,
    reconnectDelay: config.initialReconnectDelay,
    isOnline: navigator.onLine,
    latency: null,
    error: null
  });

  // Refs for timeouts and intervals
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latencyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const networkStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabaseChannelRef = useRef<any>(null);

  // Connection quality calculation
  const getConnectionQuality = useCallback((): 'good' | 'poor' | 'unknown' => {
    if (connectionState.latency === null) return 'unknown';
    return connectionState.latency <= config.latencyThreshold ? 'good' : 'poor';
  }, [connectionState.latency, config.latencyThreshold]);

  // Measure connection latency
  const measureLatency = useCallback(async (): Promise<number> => {
    const startTime = Date.now();
    
    try {
      // Simple ping to Supabase
      await supabase.from('profiles').select('id').limit(1);
      const latency = Date.now() - startTime;
      
      setConnectionState(prev => ({ ...prev, latency }));
      
      // Trigger latency callback
      if (callbacks.onLatencyChange) {
        callbacks.onLatencyChange(latency);
      }
      
      return latency;
    } catch (error) {
      console.warn('Failed to measure latency:', error);
      return -1;
    }
  }, [callbacks]);

  // Check network status
  const checkNetworkStatus = useCallback(async (): Promise<boolean> => {
    const isOnline = navigator.onLine;
    
    setConnectionState(prev => ({ ...prev, isOnline }));
    
    if (isOnline && connectionState.status === 'disconnected') {
      // Network came back online, attempt reconnection
      reconnect();
    }
    
    return isOnline;
  }, [connectionState.status]);

  // Setup heartbeat monitoring
  const setupHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(async () => {
      if (connectionState.status === 'connected') {
        try {
          await measureLatency();
        } catch (error) {
          console.warn('Heartbeat failed:', error);
          setConnectionState(prev => ({
            ...prev,
            status: 'disconnected',
            lastDisconnected: new Date(),
            error: 'Heartbeat failed'
          }));
          
          if (callbacks.onDisconnected) {
            callbacks.onDisconnected(error as Error);
          }
          
          // Attempt reconnection
          reconnect();
        }
      }
    }, config.heartbeatInterval);
  }, [connectionState.status, config.heartbeatInterval, measureLatency, callbacks]);

  // Calculate exponential backoff delay
  const calculateReconnectDelay = useCallback((attempts: number): number => {
    const delay = config.initialReconnectDelay * Math.pow(config.reconnectMultiplier, attempts);
    return Math.min(delay, config.maxReconnectDelay);
  }, [config]);

  // Connect to Supabase real-time
  const connect = useCallback(async (): Promise<void> => {
    if (connectionState.status === 'connecting' || connectionState.status === 'connected') {
      return;
    }

    setConnectionState(prev => ({
      ...prev,
      status: 'connecting',
      error: null
    }));

    try {
      // Create a test channel to verify connection
      const testChannel = supabase.channel('connection-test');
      
      // Setup connection monitoring
      testChannel.subscribe((status) => {
        console.log('Connection status:', status);
        
        if (status === 'SUBSCRIBED') {
          setConnectionState(prev => ({
            ...prev,
            status: 'connected',
            lastConnected: new Date(),
            reconnectAttempts: 0,
            reconnectDelay: config.initialReconnectDelay,
            error: null
          }));

          if (callbacks.onConnected) {
            callbacks.onConnected();
          }

          // Start heartbeat monitoring
          setupHeartbeat();
          
          // Initial latency measurement
          measureLatency();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          throw new Error(`Connection failed: ${status}`);
        }
      });

      supabaseChannelRef.current = testChannel;
      
    } catch (error) {
      console.error('Connection failed:', error);
      
      setConnectionState(prev => ({
        ...prev,
        status: 'failed',
        error: (error as Error).message
      }));
      
      if (callbacks.onReconnectFailed) {
        callbacks.onReconnectFailed(error as Error);
      }
      
      throw error;
    }
  }, [connectionState.status, config, callbacks, setupHeartbeat, measureLatency]);

  // Disconnect from Supabase
  const disconnect = useCallback(() => {
    // Clear all intervals and timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (latencyTimeoutRef.current) {
      clearTimeout(latencyTimeoutRef.current);
      latencyTimeoutRef.current = null;
    }

    // Close Supabase channel
    if (supabaseChannelRef.current) {
      supabase.removeChannel(supabaseChannelRef.current);
      supabaseChannelRef.current = null;
    }

    setConnectionState(prev => ({
      ...prev,
      status: 'disconnected',
      lastDisconnected: new Date(),
      error: null
    }));

    if (callbacks.onDisconnected) {
      callbacks.onDisconnected();
    }
  }, [callbacks]);

  // Reconnect with exponential backoff
  const reconnect = useCallback(async (): Promise<void> => {
    const currentAttempts = connectionState.reconnectAttempts;
    
    if (currentAttempts >= config.maxReconnectAttempts) {
      setConnectionState(prev => ({
        ...prev,
        status: 'failed',
        error: 'Maximum reconnection attempts exceeded'
      }));
      
      if (callbacks.onReconnectFailed) {
        callbacks.onReconnectFailed(new Error('Maximum reconnection attempts exceeded'));
      }
      
      return;
    }

    const delay = calculateReconnectDelay(currentAttempts);
    
    setConnectionState(prev => ({
      ...prev,
      status: 'reconnecting',
      reconnectAttempts: currentAttempts + 1,
      reconnectDelay: delay
    }));

    if (callbacks.onReconnecting) {
      callbacks.onReconnecting(currentAttempts + 1);
    }

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        await connect();
        
        if (callbacks.onReconnected) {
          callbacks.onReconnected();
        }
      } catch (error) {
        console.error(`Reconnection attempt ${currentAttempts + 1} failed:`, error);
        // Will attempt again through the recursive call
        reconnect();
      }
    }, delay);
  }, [connectionState.reconnectAttempts, config.maxReconnectAttempts, calculateReconnectDelay, callbacks, connect]);

  // Reset reconnection attempts
  const resetReconnectionAttempts = useCallback(() => {
    setConnectionState(prev => ({
      ...prev,
      reconnectAttempts: 0,
      reconnectDelay: config.initialReconnectDelay
    }));
  }, [config.initialReconnectDelay]);

  // Setup network status monitoring
  useEffect(() => {
    if (!enabled) return;

    const handleOnline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: true }));
      if (connectionState.status === 'disconnected') {
        reconnect();
      }
    };

    const handleOffline = () => {
      setConnectionState(prev => ({ ...prev, isOnline: false }));
      disconnect();
    };

    // Setup network event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup periodic network status checks
    networkStatusIntervalRef.current = setInterval(
      checkNetworkStatus,
      config.networkStatusPollInterval
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (networkStatusIntervalRef.current) {
        clearInterval(networkStatusIntervalRef.current);
      }
    };
  }, [enabled, connectionState.status, config.networkStatusPollInterval, checkNetworkStatus, reconnect, disconnect]);

  // Initial connection setup
  useEffect(() => {
    if (enabled && connectionState.status === 'disconnected' && navigator.onLine) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled]);

  // Actions object
  const actions: ConnectionActions = {
    connect,
    disconnect,
    reconnect,
    resetReconnectionAttempts: resetReconnectionAttempts,
    measureLatency,
    checkNetworkStatus
  };

  return {
    connectionState,
    actions,
    isConnected: connectionState.status === 'connected',
    isReconnecting: connectionState.status === 'reconnecting',
    connectionQuality: getConnectionQuality()
  };
}