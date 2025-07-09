import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, Loader2, Lock, Globe, UserCheck } from 'lucide-react';
import { 
  parseBelayGroupMessage, 
  formatSessionDate, 
  getTimeUntilSession,
  canJoinBelayGroup
} from '@/utils/belayGroupUtils';
import { BelayGroup } from '@/types/belayGroup';
import { CLIMBING_TYPE_ICONS } from '@/types/belayGroup';

interface BelayGroupMessageButtonProps {
  message: string;
  isOwnMessage: boolean;
}

export const BelayGroupMessageButton: React.FC<BelayGroupMessageButtonProps> = ({
  message,
  isOwnMessage
}) => {
  const [belayGroup, setBelayGroup] = useState<BelayGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const parsedMessage = parseBelayGroupMessage(message);

  useEffect(() => {
    if (!parsedMessage || !user) {
      return;
    }

    const fetchBelayGroup = async () => {
      try {
        // Fetch belay group details
        const { data: groupData, error: groupError } = await supabase
          .from('belay_groups')
          .select(`
            *,
            creator:profiles!creator_id(display_name, avatar_url),
            gym:groups!gym_id(name)
          `)
          .eq('id', parsedMessage.id)
          .single();

        if (groupError) throw groupError;

        // Fetch participant count and check if user is participant
        const { data: participants, error: participantsError } = await supabase
          .from('belay_group_participants')
          .select('user_id')
          .eq('belay_group_id', parsedMessage.id);

        if (participantsError) throw participantsError;

        setBelayGroup(groupData);
        setParticipantCount(participants.length);
        setIsParticipant(participants.some(p => p.user_id === user.id));
      } catch (error) {
        console.error('Error fetching belay group:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBelayGroup();

    // Subscribe to participant changes
    const participantSubscription = supabase
      .channel(`belay_group_participants_${parsedMessage.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'belay_group_participants',
          filter: `belay_group_id=eq.${parsedMessage.id}`
        },
        () => {
          fetchBelayGroup();
        }
      )
      .subscribe();

    return () => {
      participantSubscription.unsubscribe();
    };
  }, [parsedMessage, user]);

  const handleJoinGroup = async () => {
    if (!user || !belayGroup || isParticipant) return;

    setIsJoining(true);
    try {
      const { error } = await supabase
        .from('belay_group_participants')
        .insert([
          {
            belay_group_id: belayGroup.id,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Joined belay group!',
        description: `You've joined "${belayGroup.name}". Check the belay groups page for chat access.`,
      });

      setIsParticipant(true);
    } catch (error) {
      console.error('Error joining belay group:', error);
      toast({
        title: 'Error joining group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleNavigateToChat = () => {
    if (!belayGroup) return;
    navigate(`/belay-groups/${belayGroup.id}/chat`);
  };

  const handleNavigateToGroups = () => {
    navigate('/belay-groups');
  };

  if (!parsedMessage || isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading belay group...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!belayGroup) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200">
        <CardContent className="p-4">
          <p className="text-sm text-red-600">Belay group not found or no longer available</p>
        </CardContent>
      </Card>
    );
  }

  const canJoin = canJoinBelayGroup(belayGroup.status, participantCount, belayGroup.capacity, belayGroup.session_date);
  const timeUntil = getTimeUntilSession(belayGroup.session_date);
  const isExpired = new Date(belayGroup.session_date) < new Date();

  return (
    <Card className={`w-full max-w-2xl transition-all hover:shadow-md ${
      isOwnMessage ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
    } ${!canJoin && !isParticipant ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        {/* First Row - Header with title, creator, and action button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-lg">{CLIMBING_TYPE_ICONS[belayGroup.climbing_type]}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{belayGroup.name}</h4>
                {belayGroup.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                {belayGroup.status === 'full' && (
                  <Badge variant="destructive" className="text-xs">
                    Full
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">by {belayGroup.creator?.display_name}</p>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="ml-4">
            {isParticipant ? (
              <Button 
                size="sm" 
                onClick={handleNavigateToChat}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Accept Invitation
              </Button>
            ) : canJoin ? (
              <Button 
                size="sm" 
                onClick={handleJoinGroup}
                disabled={isJoining}
              >
                {isJoining && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                <Users className="h-3 w-3 mr-1" />
                Join Group
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={handleNavigateToGroups}>
                View Belay Groups
              </Button>
            )}
          </div>
        </div>

        {/* Second Row - Details and description */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{belayGroup.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatSessionDate(belayGroup.session_date, 'short')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{participantCount}/{belayGroup.capacity} climbers</span>
            </div>
          </div>
          
          {/* Description or error message */}
          <div className="ml-4 flex-1 text-right">
            {!canJoin && !isParticipant ? (
              <p className="text-xs text-muted-foreground">
                {belayGroup.status === 'full' 
                  ? 'Group is full' 
                  : isExpired 
                    ? 'Session has ended' 
                    : 'No longer available'
                }
              </p>
            ) : belayGroup.description ? (
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {belayGroup.description}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};