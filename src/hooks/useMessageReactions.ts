import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ReactionCount {
  emoji: string;
  count: number;
  user_has_reacted: boolean;
}

export function useMessageReactions(messageType: string, messageId: string) {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load reaction counts for a message
  const loadReactions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_message_reaction_counts', {
        p_message_type: messageType,
        p_message_id: messageId
      });

      if (error) throw error;
      setReactions(data || []);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  // Toggle a reaction
  const toggleReaction = async (emoji: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('toggle_message_reaction', {
        p_message_type: messageType,
        p_message_id: messageId,
        p_emoji: emoji
      });

      if (error) throw error;
      
      // Reload reactions to get updated counts
      await loadReactions();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load reactions on mount and when message changes
  useEffect(() => {
    if (messageId && messageType) {
      loadReactions();
    }
  }, [messageId, messageType]);

  // Set up real-time subscription for reaction changes
  useEffect(() => {
    if (!messageId || !messageType) return;

    const channel = supabase
      .channel(`message-reactions-${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`
        },
        () => {
          // Reload reactions when any reaction changes
          loadReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, messageType]);

  return {
    reactions,
    toggleReaction,
    loading,
    reload: loadReactions
  };
}