import { useState, useCallback, useMemo } from 'react';
import { BaseMessage } from '../types';

interface UseChatSearchOptions {
  messages: BaseMessage[];
  searchFields?: string[];
  caseSensitive?: boolean;
  enabled?: boolean;
}

export function useChatSearch({
  messages,
  searchFields = ['content', 'profiles.display_name'],
  caseSensitive = false,
  enabled = true
}: UseChatSearchOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Filter messages based on search term
  const filteredMessages = useMemo(() => {
    if (!enabled || !searchTerm.trim()) {
      return messages;
    }

    const query = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    
    return messages.filter(message => {
      // Search in content
      if (searchFields.includes('content')) {
        const content = caseSensitive ? message.content : message.content.toLowerCase();
        if (content.includes(query)) return true;
      }
      
      // Search in username
      if (searchFields.includes('profiles.display_name') && message.profiles?.display_name) {
        const username = caseSensitive 
          ? message.profiles.display_name 
          : message.profiles.display_name.toLowerCase();
        if (username.includes(query)) return true;
      }
      
      // Search in user ID (exact match)
      if (searchFields.includes('user_id')) {
        if (message.user_id === searchTerm) return true;
      }
      
      return false;
    });
  }, [messages, searchTerm, searchFields, caseSensitive, enabled]);

  // Search with highlighted results
  const searchWithHighlights = useMemo(() => {
    if (!enabled || !searchTerm.trim()) {
      return filteredMessages.map(msg => ({ ...msg, highlights: {} }));
    }

    return filteredMessages.map(message => {
      const highlights: Record<string, string> = {};
      const query = caseSensitive ? searchTerm : searchTerm.toLowerCase();
      
      // Highlight content
      if (searchFields.includes('content')) {
        const content = caseSensitive ? message.content : message.content.toLowerCase();
        if (content.includes(query)) {
          highlights.content = highlightText(message.content, searchTerm, caseSensitive);
        }
      }
      
      // Highlight username
      if (searchFields.includes('profiles.display_name') && message.profiles?.display_name) {
        const username = caseSensitive 
          ? message.profiles.display_name 
          : message.profiles.display_name.toLowerCase();
        if (username.includes(query)) {
          highlights.username = highlightText(message.profiles.display_name, searchTerm, caseSensitive);
        }
      }
      
      return { ...message, highlights };
    });
  }, [filteredMessages, searchTerm, searchFields, caseSensitive, enabled]);

  // Get search statistics
  const searchStats = useMemo(() => ({
    totalMessages: messages.length,
    matchingMessages: filteredMessages.length,
    searchTerm: searchTerm.trim(),
    hasResults: filteredMessages.length > 0,
    isEmpty: searchTerm.trim() === ''
  }), [messages.length, filteredMessages.length, searchTerm]);

  // Update search term
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Toggle search visibility
  const toggleSearch = useCallback(() => {
    setShowSearch(prev => {
      if (prev) {
        // If closing search, clear the term
        setSearchTerm('');
      }
      return !prev;
    });
  }, []);

  // Add to search history
  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(item => item !== term)];
      return newHistory.slice(0, 10); // Keep only last 10 searches
    });
  }, []);

  // Search by user
  const searchByUser = useCallback((userId: string, username?: string) => {
    const userMessages = messages.filter(msg => msg.user_id === userId);
    setSearchTerm(username || `user:${userId}`);
    return userMessages;
  }, [messages]);

  // Search by date range
  const searchByDateRange = useCallback((startDate: Date, endDate: Date) => {
    const dateFilteredMessages = messages.filter(msg => {
      const messageDate = new Date(msg.created_at);
      return messageDate >= startDate && messageDate <= endDate;
    });
    
    const dateQuery = `${startDate.toDateString()} - ${endDate.toDateString()}`;
    setSearchTerm(dateQuery);
    return dateFilteredMessages;
  }, [messages]);

  // Quick search presets
  const quickSearchPresets = useMemo(() => ({
    myMessages: () => searchByUser('current_user_id', 'My messages'),
    today: () => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return searchByDateRange(startOfDay, today);
    },
    thisWeek: () => {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return searchByDateRange(weekAgo, today);
    }
  }), [searchByUser, searchByDateRange]);

  return {
    searchTerm,
    showSearch,
    searchHistory,
    filteredMessages,
    searchWithHighlights,
    searchStats,
    updateSearchTerm,
    clearSearch,
    toggleSearch,
    addToHistory,
    searchByUser,
    searchByDateRange,
    quickSearchPresets,
    setSearchTerm,
    setShowSearch
  };
}

// Helper function to highlight text
function highlightText(text: string, query: string, caseSensitive: boolean): string {
  if (!query.trim()) return text;
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(`(${escapeRegExp(query)})`, flags);
  
  return text.replace(regex, '<mark>$1</mark>');
}

// Helper function to escape regex special characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}