import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageService } from '@/services';
import { useToast } from '@/components/ui/use-toast';

type ChatType = 'group' | 'event' | 'club' | 'belay_group';

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export function useChatMessages(chatType: ChatType, chatId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Build query key and fetch function based on chat type
  const queryKey = chatId ? [chatType, 'messages', chatId] : [chatType, 'messages'];
  
  const fetchMessages = useCallback(async (): Promise<Message[]> => {
    switch (chatType) {
      case 'group':
        if (!chatId) throw new Error('Group ID required');
        return MessageService.getGroupMessages(chatId);
      case 'event':
        if (!chatId) throw new Error('Event ID required');
        return MessageService.getEventMessages(chatId);
      case 'belay_group':
        if (!chatId) throw new Error('Belay group ID required');
        return MessageService.getBelayGroupMessages(chatId);
      case 'club':
        return MessageService.getClubMessages();
      default:
        throw new Error(`Unsupported chat type: ${chatType}`);
    }
  }, [chatType, chatId]);

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: fetchMessages,
    enabled: chatType === 'club' || !!chatId,
    staleTime: 30000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      switch (chatType) {
        case 'group':
          if (!chatId) throw new Error('Group ID required');
          const { error: groupError } = await supabase
            .from('group_messages')
            .insert([{ content, user_id: user.data.user.id, group_id: chatId }]);
          if (groupError) throw groupError;
          break;
          
        case 'event':
          if (!chatId) throw new Error('Event ID required');
          const { error: eventError } = await supabase
            .from('event_messages')
            .insert([{ content, user_id: user.data.user.id, event_id: chatId }]);
          if (eventError) throw eventError;
          break;
          
        case 'belay_group':
          if (!chatId) throw new Error('Belay group ID required');
          const { error: belayError } = await supabase
            .from('belay_group_messages')
            .insert([{ content, user_id: user.data.user.id, belay_group_id: chatId }]);
          if (belayError) throw belayError;
          break;
          
        case 'club':
          const { error: clubError } = await supabase
            .from('club_messages')
            .insert([{ content, user_id: user.data.user.id }]);
          if (clubError) throw clubError;
          break;
          
        default:
          throw new Error(`Unsupported chat type: ${chatType}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete messages mutation
  const deleteMessagesMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      switch (chatType) {
        case 'group':
          const { error: groupError } = await supabase
            .from('group_messages')
            .delete()
            .in('id', messageIds);
          if (groupError) throw groupError;
          break;
          
        case 'event':
          const { error: eventError } = await supabase
            .from('event_messages')
            .delete()
            .in('id', messageIds);
          if (eventError) throw eventError;
          break;
          
        case 'belay_group':
          const { error: belayError } = await supabase
            .from('belay_group_messages')
            .delete()
            .in('id', messageIds);
          if (belayError) throw belayError;
          break;
          
        case 'club':
          const { error: clubError } = await supabase
            .from('club_messages')
            .delete()
            .in('id', messageIds);
          if (clubError) throw clubError;
          break;
          
        default:
          throw new Error(`Unsupported chat type: ${chatType}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setSelectedMessages(new Set());
      setIsDeleteMode(false);
      toast({ title: 'Messages deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete messages',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!chatId && chatType !== 'club') return;

    const getTableAndFilter = () => {
      switch (chatType) {
        case 'group':
          return { table: 'group_messages', filter: `group_id=eq.${chatId}` };
        case 'event':
          return { table: 'event_messages', filter: `event_id=eq.${chatId}` };
        case 'belay_group':
          return { table: 'belay_group_messages', filter: `belay_group_id=eq.${chatId}` };
        case 'club':
          return { table: 'club_messages', filter: undefined };
        default:
          throw new Error(`Unsupported chat type: ${chatType}`);
      }
    };

    const { table, filter } = getTableAndFilter();
    const channel = supabase
      .channel(`${table}_${chatId || 'club'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatType, chatId, queryClient, queryKey]);

  const toggleMessageSelection = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const deleteSelectedMessages = useCallback(() => {
    if (selectedMessages.size > 0) {
      deleteMessagesMutation.mutate(Array.from(selectedMessages));
    }
  }, [selectedMessages, deleteMessagesMutation]);

  const sendMessage = useCallback((content: string) => {
    sendMessageMutation.mutate(content);
  }, [sendMessageMutation]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isDeleteMode,
    setIsDeleteMode,
    selectedMessages,
    toggleMessageSelection,
    deleteSelectedMessages,
    isSending: sendMessageMutation.isPending,
    isDeleting: deleteMessagesMutation.isPending,
    refetch,
  };
}