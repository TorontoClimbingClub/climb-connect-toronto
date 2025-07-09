import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Hash, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ActiveChat } from '@/hooks/useDashboard';

interface ActiveChatsProps {
  chats: ActiveChat[];
  isLoading?: boolean;
}

export function ActiveChats({ chats, isLoading }: ActiveChatsProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getChatIcon = (type: 'event' | 'group' | 'club') => {
    switch (type) {
      case 'event':
        return Calendar;
      case 'group':
        return Users;
      case 'club':
        return Hash;
      default:
        return MessageSquare;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Community Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Community Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const Icon = getChatIcon(chat.type);
              return (
                <Link
                  key={`${chat.type}-${chat.id}`}
                  to={chat.href}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer hover:border-green-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>{chat.messageCount} messages</span>
                        </span>
                        {chat.lastActivity && (
                          <span className="text-xs">•</span>
                        )}
                        {chat.lastActivity && (
                          <span className="text-xs">
                            {formatTimeAgo(chat.lastActivity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {chat.type === 'club' ? 'Club Talk' : chat.type}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No active chats yet</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/club-talk">Start Club Discussion</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/events">Join Event Chat</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}