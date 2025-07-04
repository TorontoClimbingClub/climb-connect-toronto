// Utility functions for message processing
import React from 'react';

export interface MentionMatch {
  username: string;
  startIndex: number;
  endIndex: number;
}

export function extractMentions(content: string): MentionMatch[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: MentionMatch[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      username: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return mentions;
}

export function highlightMentions(content: string, currentUsername: string): React.ReactNode[] {
  const mentions = extractMentions(content);
  
  if (mentions.length === 0) {
    return [content];
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  mentions.forEach((mention, index) => {
    // Add text before mention
    if (mention.startIndex > lastIndex) {
      parts.push(content.slice(lastIndex, mention.startIndex));
    }

    // Add highlighted mention
    const isSelfMention = mention.username.toLowerCase() === currentUsername.toLowerCase();
    parts.push(
      <span
        key={`mention-${index}`}
        className={`font-semibold ${
          isSelfMention 
            ? 'text-blue-600 bg-blue-100 px-1 rounded' 
            : 'text-green-600'
        }`}
      >
        @{mention.username}
      </span>
    );

    lastIndex = mention.endIndex;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

export function searchMessages(messages: any[], query: string): any[] {
  if (!query.trim()) return messages;

  const lowercaseQuery = query.toLowerCase();
  
  return messages.filter(message => {
    // Search in message content
    if (message.content.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Search in username
    if (message.username?.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Search in mentions
    const mentions = extractMentions(message.content);
    if (mentions.some(mention => 
      mention.username.toLowerCase().includes(lowercaseQuery)
    )) {
      return true;
    }
    
    return false;
  });
}

export function getUserSuggestions(allUsers: any[], query: string): any[] {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return allUsers
    .filter(user => 
      user.display_name?.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, 5); // Limit to 5 suggestions
}

export function insertMention(
  content: string, 
  cursorPosition: number, 
  username: string
): { newContent: string; newCursorPosition: number } {
  // Find the start of the current @mention being typed
  let mentionStart = cursorPosition;
  while (mentionStart > 0 && content[mentionStart - 1] !== '@') {
    mentionStart--;
  }
  
  if (mentionStart > 0 && content[mentionStart - 1] === '@') {
    mentionStart--; // Include the @
    
    const newContent = 
      content.slice(0, mentionStart) + 
      `@${username} ` + 
      content.slice(cursorPosition);
    
    const newCursorPosition = mentionStart + username.length + 2; // +2 for @ and space
    
    return { newContent, newCursorPosition };
  }
  
  // If no @ found, just insert @username at cursor
  const newContent = 
    content.slice(0, cursorPosition) + 
    `@${username} ` + 
    content.slice(cursorPosition);
  
  const newCursorPosition = cursorPosition + username.length + 2;
  
  return { newContent, newCursorPosition };
}

export const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '👏', '💪'];

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 24 * 7) {
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}