import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableList } from '@/components/ui/searchable-list';
import { ActionDialog } from '@/components/ui/action-dialog';
import { useBelayGroups } from '@/hooks/useBelayGroups';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, UserCheck, Globe, Lock, Trash2 } from 'lucide-react';
import { BelayGroup, ClimbingType, CLIMBING_TYPE_LABELS, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';
import { formatSessionDate, getTimeUntilSession, canJoinBelayGroup } from '@/utils/belayGroupUtils';
import { Button } from '@/components/ui/button';

export default function BelayGroups() {
  const [climbingTypeFilter, setClimbingTypeFilter] = useState<'all' | ClimbingType>('all');
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'public' | 'private' | 'joined'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    belayGroups,
    isLoading,
    error,
    joinGroup,
    deleteGroup,
    isJoining,
    isDeleting
  } = useBelayGroups();

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = belayGroups;

    // Climbing type filter
    if (climbingTypeFilter !== 'all') {
      filtered = filtered.filter(group => group.climbing_type === climbingTypeFilter);
    }

    // Privacy filter
    if (privacyFilter === 'public') {
      filtered = filtered.filter(group => group.privacy === 'public');
    } else if (privacyFilter === 'private') {
      filtered = filtered.filter(group => group.privacy === 'private' && group.is_participant);
    } else if (privacyFilter === 'joined') {
      filtered = filtered.filter(group => group.is_participant);
    }

    // Sort: joined groups first, then by session date
    filtered.sort((a, b) => {
      if (a.is_participant && !b.is_participant) return -1;
      if (!a.is_participant && b.is_participant) return 1;
      return new Date(a.session_date).getTime() - new Date(b.session_date).getTime();
    });

    return filtered;
  }, [belayGroups, climbingTypeFilter, privacyFilter]);

  const handleOpenChat = (groupId: string) => {
    navigate(`/belay-groups/${groupId}/chat`);
  };

  const handleDeleteClick = (groupId: string) => {
    setGroupToDelete(groupId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      await deleteGroup(groupToDelete);
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const renderGroupItem = (group: any) => {
    const canJoin = canJoinBelayGroup(group.status, group.participant_count, group.capacity, group.session_date);
    const timeUntil = getTimeUntilSession(group.session_date);

    return (
      <div className="flex items-center justify-between">
        {/* Mobile layout */}
        <div className="md:hidden w-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{CLIMBING_TYPE_ICONS[group.climbing_type]}</span>
              <div>
                <h3 className="text-base font-semibold">{group.name}</h3>
                <p className="text-sm text-muted-foreground">
                  by {group.creator?.display_name} • {group.gym?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
              {group.is_participant && <UserCheck className="h-3 w-3 text-green-600" />}
            </div>
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{group.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatSessionDate(group.session_date, 'short')}</span>
              <Badge variant="outline" className="text-xs">{timeUntil}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{group.participant_count}/{group.capacity} climbers</span>
              <Badge variant={group.status === 'full' ? 'destructive' : 'default'} className="text-xs">
                {group.status === 'full' ? 'Full' : 'Available'}
              </Badge>
            </div>
          </div>

          {group.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {group.description}
            </p>
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <span className="text-2xl">{CLIMBING_TYPE_ICONS[group.climbing_type]}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              {group.privacy === 'private' && <Lock className="h-4 w-4 text-muted-foreground" />}
              {group.is_participant && <UserCheck className="h-4 w-4 text-green-600" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              by {group.creator?.display_name} • {group.gym?.name}
            </p>
            {group.description && (
              <p className="text-sm text-muted-foreground mb-2 max-w-2xl">
                {group.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{group.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatSessionDate(group.session_date, 'short')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{group.participant_count}/{group.capacity} climbers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupActions = (group: any) => {
    const canJoin = canJoinBelayGroup(group.status, group.participant_count, group.capacity, group.session_date);
    const timeUntil = getTimeUntilSession(group.session_date);

    return (
      <div className="flex items-center gap-3">
        {/* Desktop status badges */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <Badge variant="outline">{timeUntil}</Badge>
          <Badge variant={group.status === 'full' ? 'destructive' : 'default'}>
            {group.status === 'full' ? 'Full' : 'Available'}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {group.is_participant ? (
            <>
              <Button 
                onClick={() => handleOpenChat(group.id)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Open Chat
              </Button>
              {group.creator_id === user?.id && group.participant_count === 1 && (
                <Button 
                  onClick={() => handleDeleteClick(group.id)}
                  disabled={isDeleting}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              )}
            </>
          ) : canJoin ? (
            <Button 
              onClick={() => joinGroup(group.id)}
              disabled={isJoining}
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Join Group
            </Button>
          ) : (
            <Button disabled size="sm">
              {group.status === 'full' ? 'Group Full' : 'Session Ended'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const filters = (
    <>
      <Select value={climbingTypeFilter} onValueChange={(value) => setClimbingTypeFilter(value as 'all' | ClimbingType)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Climbing Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {Object.entries(CLIMBING_TYPE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {CLIMBING_TYPE_ICONS[key as ClimbingType]} {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={privacyFilter} onValueChange={(value) => setPrivacyFilter(value as typeof privacyFilter)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Groups</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="joined">Joined</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-6 pt-[10px]">
      <SearchableList
        data={filteredGroups}
        searchFields={['name', 'location', 'gym.name', 'creator.display_name']}
        searchPlaceholder="Search groups, locations, gyms..."
        isLoading={isLoading}
        error={error}
        emptyState={{
          icon: <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />,
          title: 'No belay groups found',
          description: 'Create a belay group in a gym chat to get started!'
        }}
        renderItem={renderGroupItem}
        renderActions={renderGroupActions}
        filters={filters}
        itemClassName={(group: any) => 
          `transition-all hover:shadow-lg ${group.is_participant ? 'border-green-200 bg-green-50' : ''}`
        }
      />

      <ActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Belay Group"
        description="Are you sure you want to delete this belay group? This action cannot be undone."
        actionLabel="Delete"
        onAction={handleDeleteConfirm}
        isLoading={isDeleting}
        variant="destructive"
        icon={<Trash2 className="h-12 w-12 text-destructive" />}
      />
    </div>
  );
}