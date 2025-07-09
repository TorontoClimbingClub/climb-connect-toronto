import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import { GroupCard } from '@/components/cards/GroupCard';
import { useToast } from "@/components/ui/use-toast";

export default function Groups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    myGroups,
    availableGroups,
    isLoading,
    joinGroup,
    leaveGroup,
    isJoining,
    isLeaving
  } = useGroups();

  const [leaveGroupId, setLeaveGroupId] = useState<string | null>(null);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'joined' | 'available'>('all');

  const handleLeaveClick = (groupId: string) => {
    setLeaveGroupId(groupId);
    setIsLeaveDialogOpen(true);
  };

  const confirmLeave = () => {
    if (leaveGroupId) {
      leaveGroup(leaveGroupId);
      setIsLeaveDialogOpen(false);
      setLeaveGroupId(null);
    }
  };

  const cancelLeave = () => {
    setIsLeaveDialogOpen(false);
    setLeaveGroupId(null);
  };

  const navigateToGroupChat = (groupId: string, groupName: string) => {
    navigate(`/groups/${groupId}/chat`, { 
      state: { groupName },
      replace: false
    });
  };

  const handleJoinGroup = (groupId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join groups.',
        variant: 'destructive'
      });
      return;
    }
    joinGroup(groupId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading groups...</div>
      </div>
    );
  }

  // Combine all groups for filtering
  const allGroups = [...myGroups, ...availableGroups];
  
  // Filter groups based on search and filter type
  const filteredGroups = allGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    switch (filterType) {
      case 'joined':
        return matchesSearch && group.is_member;
      case 'available':
        return matchesSearch && !group.is_member;
      default:
        return matchesSearch;
    }
  });

  const filteredJoinedGroups = filteredGroups.filter(group => group.is_member);
  const filteredAvailableGroups = filteredGroups.filter(group => !group.is_member);

  return (
    <div className="space-y-6 bg-white md:bg-white h-full -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8 overflow-y-auto md:overflow-visible">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4 justify-end">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="group-search"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'joined' | 'available')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Groups</option>
            <option value="joined">Joined</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>

      {allGroups.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups available</h3>
            <p className="text-gray-500">Groups will appear here once they are created.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* My Groups Section */}
          {filteredJoinedGroups.length > 0 && (filterType === 'all' || filterType === 'joined') && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Groups</h2>
              
              {/* Desktop Layout */}
              <div className="hidden md:block space-y-4">
                {filteredJoinedGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => navigateToGroupChat(group.id, group.name)}
                  >
                    <GroupCard
                      group={group}
                      showChatButton={true}
                      onLeave={handleLeaveClick}
                      isLeaving={isLeaving}
                      compact={true}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden desktop-grid-3">
                {filteredJoinedGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    showChatButton={true}
                    onLeave={handleLeaveClick}
                    isLeaving={isLeaving}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Available Groups Section */}
          {filteredAvailableGroups.length > 0 && (filterType === 'all' || filterType === 'available') && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {filterType === 'available' ? 'Available Groups' : 'Groups you might be interested in'}
              </h2>
              
              {/* Desktop Layout */}
              <div className="hidden md:block space-y-4">
                {filteredAvailableGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <GroupCard
                      group={group}
                      onJoin={handleJoinGroup}
                      isJoining={isJoining}
                      compact={true}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden desktop-grid-3">
                {filteredAvailableGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onJoin={handleJoinGroup}
                    isJoining={isJoining}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredGroups.length === 0 && (
            <Card className="text-center p-8">
              <CardContent>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Leave Group Confirmation Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group? You'll need to be re-invited to join again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}