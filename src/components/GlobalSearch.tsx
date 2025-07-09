import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, Users, MessageSquare, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'event' | 'group' | 'user';
  title: string;
  description?: string;
  href: string;
  meta?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const [eventsResponse, groupsResponse, usersResponse] = await Promise.all([
        // Search events
        supabase
          .from('events')
          .select('id, title, description, location, event_date')
          .or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%, location.ilike.%${searchQuery}%`)
          .limit(5),
        
        // Search groups
        supabase
          .from('groups')
          .select('id, name, description')
          .or(`name.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`)
          .limit(5),
        
        // Search users
        supabase
          .from('profiles')
          .select('id, display_name')
          .ilike('display_name', `%${searchQuery}%`)
          .limit(5)
      ]);

      const searchResults: SearchResult[] = [];

      // Add events
      if (eventsResponse.data) {
        eventsResponse.data.forEach(event => {
          searchResults.push({
            id: event.id,
            type: 'event',
            title: event.title,
            description: event.description || event.location,
            href: `/events/${event.id}`,
            meta: new Date(event.event_date).toLocaleDateString()
          });
        });
      }

      // Add groups
      if (groupsResponse.data) {
        groupsResponse.data.forEach(group => {
          searchResults.push({
            id: group.id,
            type: 'group',
            title: group.name,
            description: group.description || 'Climbing group',
            href: `/groups/${group.id}`,
            meta: 'Group'
          });
        });
      }

      // Add users
      if (usersResponse.data) {
        usersResponse.data.forEach(user => {
          searchResults.push({
            id: user.id,
            type: 'user',
            title: user.display_name,
            description: 'Community member',
            href: `/profile/${user.id}`,
            meta: 'User'
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.href);
    onClose();
    setQuery('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'group':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'user':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultBadgeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-orange-100 text-orange-800';
      case 'group':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="global-search"
              placeholder="Search events, groups, or people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto chat-scrollbar">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getResultBadgeColor(result.type)}`}>
                      {result.meta || result.type}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Type at least 2 characters to search</p>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p><kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd> to open search</p>
                <p><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}