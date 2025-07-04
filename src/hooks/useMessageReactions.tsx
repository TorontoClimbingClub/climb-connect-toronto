import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Reaction {
  emoji: string;
  count: number;
  users: Array<{
    id: string;
    username: string;
  }>;
  hasReacted?: boolean;
}

export function useMessageReactions(messageId: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!messageId) return;

    const loadReactions = async () => {
      const { data } = await supabase
        .from('message_reactions')
        .select(`
          emoji,
          user_id,
          profiles (
            display_name
          )
        `)
        .eq('message_id', messageId);

      if (data) {
        // Group reactions by emoji
        const groupedReactions: { [emoji: string]: Reaction } = {};
        
        data.forEach((reaction: any) => {
          const emoji = reaction.emoji;
          if (!groupedReactions[emoji]) {
            groupedReactions[emoji] = {
              emoji,
              count: 0,
              users: [],
              hasReacted: false,
            };
          }
          
          groupedReactions[emoji].count++;
          groupedReactions[emoji].users.push({
            id: reaction.user_id,
            username: reaction.profiles?.display_name || 'Anonymous',
          });
          
          if (reaction.user_id === user?.id) {
            groupedReactions[emoji].hasReacted = true;
          }
        });

        setReactions(Object.values(groupedReactions));
      }
    };

    loadReactions();

    // Subscribe to reaction changes for this message
    const channel = supabase
      .channel(`reactions-${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`,
        },
        () => {
          // Reload reactions when they change
          loadReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, user]);

  const addReaction = async (emoji: string) => {
    if (!user || !messageId) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        });

      if (error && error.code !== '23505') { // Ignore unique constraint violations
        console.error('Error adding reaction:', error);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const removeReaction = async (emoji: string) => {
    if (!user || !messageId) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (error) {
        console.error('Error removing reaction:', error);
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const toggleReaction = async (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    if (reaction?.hasReacted) {
      await removeReaction(emoji);
    } else {
      await addReaction(emoji);
    }
  };

  return {
    reactions,
    addReaction,
    removeReaction,
    toggleReaction,
  };
}