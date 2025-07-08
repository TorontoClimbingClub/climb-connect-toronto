
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Upload, User, Shield, MessageSquare, Calendar, Edit2, Save, X, Trash2, Settings } from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
}

interface GroupChat {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  member_count?: number;
}

interface EventChat {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string;
  created_at: string;
  participant_count?: number;
}


export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Admin section states
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [eventChats, setEventChats] = useState<EventChat[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDescription, setEditGroupDescription] = useState('');
  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEventDescription, setEditEventDescription] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventLocation, setEditEventLocation] = useState('');
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setDisplayName(data.display_name);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your display name has been updated.",
      });

      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const updateGroup = async (groupId: string, newName: string, newDescription: string) => {
    if (!profile?.is_admin || !newName.trim()) return;
    
    try {
      console.log('Admin updating group:', { groupId, newName, adminUserId: user?.id, isAdmin: profile?.is_admin });
      
      const { error } = await supabase
        .from('groups')
        .update({ 
          name: newName.trim(),
          description: newDescription.trim() || null
        })
        .eq('id', groupId);

      if (error) {
        console.error('Supabase error updating group:', error);
        
        // Check if it's a policy violation (RLS issue)
        if (error.code === 'PGRST116' || error.message?.includes('policy')) {
          throw new Error(`Permission denied: Admin privileges may not be properly configured. Please check your admin status and database policies. Technical details: ${error.message}`);
        }
        
        // Check for unique constraint violation
        if (error.code === '23505' || error.message?.includes('unique')) {
          throw new Error(`A group with the name "${newName.trim()}" already exists. Please choose a different name.`);
        }
        
        throw error;
      }

      toast({
        title: "Group updated!",
        description: "Group has been updated successfully.",
      });

      setEditingGroupId(null);
      setEditGroupName('');
      setEditGroupDescription('');
      loadAdminChats();
    } catch (error) {
      console.error('Error updating group:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update group.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateEvent = async (eventId: string, newTitle: string, newDescription: string, newDate: string, newLocation: string) => {
    if (!profile?.is_admin || !newTitle.trim() || !newDate || !newLocation.trim()) return;
    
    try {
      console.log('Admin updating event:', { eventId, newTitle, newDate, newLocation, adminUserId: user?.id, isAdmin: profile?.is_admin });
      
      const { error } = await supabase
        .from('events')
        .update({ 
          title: newTitle.trim(),
          description: newDescription.trim() || null,
          event_date: newDate,
          location: newLocation.trim()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Supabase error updating event:', error);
        
        // Check if it's a policy violation (RLS issue)
        if (error.code === 'PGRST116' || error.message?.includes('policy')) {
          throw new Error(`Permission denied: Admin privileges may not be properly configured. Please check your admin status and database policies. Technical details: ${error.message}`);
        }
        
        // Check for date validation issues
        if (error.message?.includes('invalid input syntax') && error.message?.includes('timestamp')) {
          throw new Error(`Invalid date format. Please ensure the date is properly formatted.`);
        }
        
        throw error;
      }

      toast({
        title: "Event updated!",
        description: "Event has been updated successfully.",
      });

      setEditingEventId(null);
      setEditEventTitle('');
      setEditEventDescription('');
      setEditEventDate('');
      setEditEventLocation('');
      loadAdminChats();
    } catch (error) {
      console.error('Error updating event:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startEditingGroup = (group: GroupChat) => {
    setEditingGroupId(group.id);
    setEditGroupName(group.name);
    setEditGroupDescription(group.description || '');
  };

  const startEditingEvent = (event: EventChat) => {
    setEditingEventId(event.id);
    setEditEventTitle(event.title);
    setEditEventDescription(event.description || '');
    setEditEventDate(event.event_date.split('T')[0]); // Format for date input
    setEditEventLocation(event.location);
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditingEventId(null);
    setEditGroupName('');
    setEditGroupDescription('');
    setEditEventTitle('');
    setEditEventDescription('');
    setEditEventDate('');
    setEditEventLocation('');
  };

  const deleteGroup = async (groupId: string) => {
    if (!profile?.is_admin) return;
    
    setDeleting(true);
    try {
      // First, delete all group members
      const { error: membersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

      if (membersError) throw membersError;

      // Then, delete all group messages
      const { error: messagesError } = await supabase
        .from('group_messages')
        .delete()
        .eq('group_id', groupId);

      if (messagesError) throw messagesError;

      // Finally, delete the group itself
      const { error: groupError } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (groupError) throw groupError;

      toast({
        title: "Group deleted!",
        description: "Group and all associated data have been deleted.",
      });

      setDeleteGroupId(null);
      loadAdminChats();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!profile?.is_admin) return;
    
    setDeleting(true);
    try {
      // First, delete all event participants
      const { error: participantsError } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;

      // Then, delete all event messages
      const { error: messagesError } = await supabase
        .from('event_messages')
        .delete()
        .eq('event_id', eventId);

      if (messagesError) throw messagesError;

      // Finally, delete the event itself
      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (eventError) throw eventError;

      toast({
        title: "Event deleted!",
        description: "Event and all associated data have been deleted.",
      });

      setDeleteEventId(null);
      loadAdminChats();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated.",
      });

      loadProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const loadAdminChats = async () => {
    if (!profile?.is_admin) return;
    
    setAdminLoading(true);
    try {
      // Load group chats with member count
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          description,
          created_at,
          group_members(count)
        `)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Load event chats with participant count
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          event_date,
          location,
          created_at,
          event_participants(count)
        `)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      setGroupChats(groupsData?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      })) || []);

      setEventChats(eventsData?.map(event => ({
        ...event,
        participant_count: event.event_participants?.[0]?.count || 0
      })) || []);
    } catch (error) {
      console.error('Error loading admin chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chat data.",
        variant: "destructive",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile?.is_admin) {
      loadAdminChats();
    }
  }, [profile?.is_admin]);

  if (loading) {
    return (
      <div className="w-full space-y-6 p-4">
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full p-4">
        <Card>
          <CardContent className="text-center p-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-500">Unable to load your profile information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>My Profile</span>
            {profile.is_admin && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Admin
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Member since {format(new Date(profile.created_at), 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-lg">
                {profile.display_name[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Change Avatar'}
                  </span>
                </Button>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
              <p className="text-xs text-gray-500">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
            <Button type="submit" disabled={updating || displayName === profile.display_name}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profile.is_admin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Administrator Panel</span>
            </CardTitle>
            <CardDescription>
              Manage chat groups and event titles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="groups" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="groups" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Group Chats</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Event Chats</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="groups" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Group Chats</h3>
                    <Badge variant="outline">{groupChats.length} groups</Badge>
                  </div>
                  
                  <div className="h-64 overflow-y-auto border rounded-lg p-2">
                    {adminLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {groupChats.length === 0 ? (
                          <div className="flex items-center justify-center h-32 text-gray-500">
                            <div className="text-center">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No group chats found</p>
                            </div>
                          </div>
                        ) : (
                          groupChats.map((group) => (
                            <Card key={group.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  {editingGroupId === group.id ? (
                                    <div className="space-y-3 w-full">
                                      <div className="flex items-center space-x-2">
                                        <Input
                                          value={editGroupName}
                                          onChange={(e) => setEditGroupName(e.target.value)}
                                          className="flex-1"
                                          placeholder="Group name"
                                        />
                                      </div>
                                      <Textarea
                                        value={editGroupDescription}
                                        onChange={(e) => setEditGroupDescription(e.target.value)}
                                        className="w-full"
                                        placeholder="Group description (optional)"
                                        rows={2}
                                      />
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          onClick={() => updateGroup(group.id, editGroupName, editGroupDescription)}
                                          disabled={!editGroupName.trim()}
                                        >
                                          <Save className="h-4 w-4 mr-1" />
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditing}
                                        >
                                          <X className="h-4 w-4 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <div>
                                        <p className="font-medium">{group.name}</p>
                                        {group.description && (
                                          <p className="text-sm text-gray-600 mb-1">{group.description}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                          {group.member_count} members • Created {format(new Date(group.created_at), 'MMM d, yyyy')}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {editingGroupId !== group.id && (
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => startEditingGroup(group)}
                                      title="Edit Group"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          title="Delete Group"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Group</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{group.name}"? This will permanently delete the group, all its messages, and remove all members. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteGroup(group.id)}
                                            disabled={deleting}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {deleting ? "Deleting..." : "Delete Group"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Event Chats</h3>
                    <Badge variant="outline">{eventChats.length} events</Badge>
                  </div>
                  
                  <div className="h-64 overflow-y-auto border rounded-lg p-2">
                    {adminLoading ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {eventChats.length === 0 ? (
                          <div className="flex items-center justify-center h-32 text-gray-500">
                            <div className="text-center">
                              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No event chats found</p>
                            </div>
                          </div>
                        ) : (
                          eventChats.map((event) => (
                            <Card key={event.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  {editingEventId === event.id ? (
                                    <div className="space-y-3 w-full">
                                      <Input
                                        value={editEventTitle}
                                        onChange={(e) => setEditEventTitle(e.target.value)}
                                        placeholder="Event title"
                                      />
                                      <Textarea
                                        value={editEventDescription}
                                        onChange={(e) => setEditEventDescription(e.target.value)}
                                        placeholder="Event description (optional)"
                                        rows={2}
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <Input
                                          type="date"
                                          value={editEventDate}
                                          onChange={(e) => setEditEventDate(e.target.value)}
                                        />
                                        <Input
                                          value={editEventLocation}
                                          onChange={(e) => setEditEventLocation(e.target.value)}
                                          placeholder="Location"
                                        />
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          onClick={() => updateEvent(event.id, editEventTitle, editEventDescription, editEventDate, editEventLocation)}
                                          disabled={!editEventTitle.trim() || !editEventDate || !editEventLocation.trim()}
                                        >
                                          <Save className="h-4 w-4 mr-1" />
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditing}
                                        >
                                          <X className="h-4 w-4 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <div>
                                        <p className="font-medium">{event.title}</p>
                                        {event.description && (
                                          <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                          {event.participant_count} participants • {format(new Date(event.event_date), 'MMM d, yyyy')} • {event.location}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {editingEventId !== event.id && (
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => startEditingEvent(event)}
                                      title="Edit Event"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          title="Delete Event"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "{event.title}"? This will permanently delete the event, all its messages, and remove all participants. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => deleteEvent(event.id)}
                                            disabled={deleting}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {deleting ? "Deleting..." : "Delete Event"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
