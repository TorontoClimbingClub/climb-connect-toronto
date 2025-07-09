import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { GroupWithStats } from '@/hooks/useGroups';

interface GroupCardProps {
  group: GroupWithStats;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  showChatButton?: boolean;
  compact?: boolean;
}

export function GroupCard({
  group,
  onJoin,
  onLeave,
  isJoining = false,
  isLeaving = false,
  showChatButton = false,
  compact = false
}: GroupCardProps) {
  const isActionLoading = isJoining || isLeaving;

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={group.avatar_url} alt={group.name} />
              <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
              <p className="text-gray-600 text-sm truncate">{group.description}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{group.member_count} members</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-6">
            {group.is_member ? (
              <Button variant="default" size="sm" asChild className="pointer-events-none">
                <Link to={`/groups/${group.id}/chat`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Chat
                </Link>
              </Button>
            ) : (
              <div className={`px-4 py-2 rounded-md text-sm font-medium pointer-events-none ${
                isActionLoading
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-800'
              }`}>
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                    {isJoining ? 'Joining...' : 'Leaving...'}
                  </>
                ) : (
                  'Join Group'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.avatar_url} alt={group.name} />
            <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.is_member && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Member
                </Badge>
              )}
            </div>
            <CardDescription>{group.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          {group.member_count} members
        </div>

        {group.is_member ? (
          <div className="flex gap-2">
            {showChatButton && (
              <Button variant="default" size="sm" asChild className="flex-1">
                <Link to={`/groups/${group.id}/chat`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Link>
              </Button>
            )}
            {onLeave && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLeave(group.id)}
                disabled={isLeaving}
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  'Leave'
                )}
              </Button>
            )}
          </div>
        ) : (
          onJoin && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onJoin(group.id)}
              disabled={isActionLoading}
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join'
              )}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}