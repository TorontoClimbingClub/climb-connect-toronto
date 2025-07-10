import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';
import { useMessageReactions } from '@/hooks/useMessageReactions';

interface MessageReactionsProps {
  messageId: string;
  messageType: 'group' | 'event' | 'club' | 'belay_group';
  className?: string;
  showInline?: boolean;
}

export function MessageReactions({ messageId, messageType, className, showInline = false }: MessageReactionsProps) {
  const { reactions, toggleReaction, loading } = useMessageReactions(messageType, messageId);

  const handleEmojiSelect = async (emoji: string) => {
    await toggleReaction(emoji);
  };

  const handleReactionClick = async (emoji: string) => {
    await toggleReaction(emoji);
  };

  // If showInline is true, only show the emoji picker button
  if (showInline) {
    return (
      <EmojiPickerComponent
        onEmojiSelect={handleEmojiSelect}
        className={`opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
      />
    );
  }

  // Don't render anything if there are no reactions
  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {/* Existing reactions */}
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant="ghost"
          size="sm"
          className={`h-6 px-2 py-1 text-xs rounded-full border transition-colors ${
            reaction.user_has_reacted
              ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleReactionClick(reaction.emoji)}
          disabled={loading}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      {/* Add reaction button */}
      <EmojiPickerComponent
        onEmojiSelect={handleEmojiSelect}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
