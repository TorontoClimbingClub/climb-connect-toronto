import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, MapPin, Users, Loader2 } from 'lucide-react';

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  groupId?: string;
  groupName?: string;
  chatType?: 'group' | 'event' | 'club';
  chatId?: string;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onClose,
  groupId,
  groupName,
  chatType,
  chatId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            location,
            event_date: eventDate,
            max_participants: maxParticipants ? parseInt(maxParticipants) : null,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // If created from a group chat, automatically join the user to the event
      if (data && groupId) {
        await supabase
          .from('event_participants')
          .insert([
            {
              event_id: data.id,
              user_id: user.id,
            },
          ]);
      }

      // Post event creation message to the current chat
      if (data && chatType && chatId) {
        const eventMessage = `🎯 New Event Created: "${title}"

📅 ${new Date(eventDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })}
📍 ${location}
${description ? `\n📝 ${description}` : ''}
${maxParticipants ? `\n👥 Max ${maxParticipants} participants` : ''}

[EVENT:${data.id}] Click to join this event!`;

        let messageTable = '';
        let messageEventId = null;

        if (chatType === 'group') {
          messageTable = 'group_messages';
        } else if (chatType === 'event') {
          messageTable = 'event_messages';
          messageEventId = chatId;
        } else if (chatType === 'club') {
          messageTable = 'club_messages';
        }

        if (messageTable) {
          const messageData: any = {
            content: eventMessage,
            user_id: user.id,
          };

          if (chatType === 'group') {
            messageData.group_id = chatId;
          } else if (chatType === 'event') {
            messageData.event_id = messageEventId;
          }

          await supabase
            .from(messageTable as any) // Type assertion to handle dynamic table names
            .insert([messageData]);
        }
      }

      toast({
        title: 'Event created successfully',
        description: `${title} has been created${groupName ? ` for ${groupName}` : ''}`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setEventDate('');
      setMaxParticipants('');
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create Event
          </DialogTitle>
          <DialogDescription>
            {groupName ? `Create an event for ${groupName}` : 'Create a new climbing event'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Bouldering Session"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event details, difficulty level, what to bring..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Local climbing gym or outdoor crag"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">Date & Time</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Max Participants (optional)
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};