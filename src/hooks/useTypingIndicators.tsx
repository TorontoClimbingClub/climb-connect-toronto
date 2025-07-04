import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TypingUser {
  user_id: string;
  username: string;
  updated_at: string;
}

export function useTypingIndicators(roomName: string) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isTypingRef = useRef(false);

  // Load current typing users and subscribe to changes
  useEffect(() => {
    if (!user) return;

    const loadTypingUsers = async () => {
      const { data } = await supabase
        .from('typing_indicators')
        .select('user_id, username, updated_at')
        .eq('room_name', roomName)
        .eq('is_typing', true)
        .neq('user_id', user.id);

      setTypingUsers(data || []);
    };

    loadTypingUsers();

    // Subscribe to typing indicator changes
    const channel = supabase
      .channel(`typing-${roomName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `room_name=eq.${roomName}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const data = payload.new as any;
            if (data.user_id !== user.id && data.is_typing) {
              setTypingUsers(prev => {
                const filtered = prev.filter(u => u.user_id !== data.user_id);
                return [...filtered, {
                  user_id: data.user_id,
                  username: data.username,
                  updated_at: data.updated_at,
                }];
              });
            } else if (data.user_id !== user.id && !data.is_typing) {
              setTypingUsers(prev => prev.filter(u => u.user_id !== data.user_id));
            }
          } else if (payload.eventType === 'DELETE') {
            const data = payload.old as any;
            if (data.user_id !== user.id) {
              setTypingUsers(prev => prev.filter(u => u.user_id !== data.user_id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName, user]);

  // Clean up old typing indicators periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(u => 
          new Date().getTime() - new Date(u.updated_at).getTime() < 10000
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const setTyping = useCallback(async (typing: boolean) => {
    if (!user) return;

    const username = user.user_metadata?.display_name || user.email || 'Anonymous';

    try {
      if (typing) {
        isTypingRef.current = true;
        await supabase
          .from('typing_indicators')
          .upsert({
            room_name: roomName,
            user_id: user.id,
            username,
            is_typing: true,
            updated_at: new Date().toISOString(),
          });
      } else {
        isTypingRef.current = false;
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('room_name', roomName)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [roomName, user]);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      setTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 3000);
  }, [setTyping]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping(false);
  }, [setTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTyping(false);
    };
  }, [setTyping]);

  return {
    typingUsers,
    handleTyping,
    stopTyping,
  };
}