import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName?: string;
  onEventCreated?: (eventTitle: string, eventDate: string) => void;
}

export function CreateEventModal({ 
  isOpen, 
  onClose, 
  groupName,
  onEventCreated 
}: CreateEventModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    max_participants: '8',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Smart defaults based on group name
  const getLocationSuggestion = (groupName?: string) => {
    if (!groupName) return '';
    if (groupName.toLowerCase().includes('basecamp')) return 'Basecamp Climbing';
    if (groupName.toLowerCase().includes('true north')) return 'True North Climbing';
    if (groupName.toLowerCase().includes('joe rockheads')) return 'Joe Rockheads';
    return '';
  };

  const getTitleSuggestion = (groupName?: string) => {
    if (!groupName) return '';
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const gymName = groupName.split(' ')[0]; // Get first word (Basecamp, True, Joe)
    return `${day} Climbing Session`;
  };

  const getDefaultDate = () => {
    const now = new Date();
    const nextWeekend = new Date(now);
    nextWeekend.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    nextWeekend.setHours(14, 0, 0, 0); // 2 PM
    return nextWeekend.toISOString().slice(0, 16); // Format for datetime-local
  };

  // Initialize smart defaults when modal opens
  const handleModalOpen = () => {
    if (isOpen && !formData.location) {
      setFormData(prev => ({
        ...prev,
        title: prev.title || getTitleSuggestion(groupName),
        location: getLocationSuggestion(groupName),
        event_date: prev.event_date || getDefaultDate()
      }));
    }
  };

  React.useEffect(() => {
    handleModalOpen();
  }, [isOpen, groupName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create events.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.title || !formData.location || !formData.event_date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            event_date: formData.event_date,
            max_participants: parseInt(formData.max_participants) || 8,
            created_by: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Event created!',
        description: 'Your event has been created successfully.',
      });

      // Call callback with event details
      onEventCreated?.(formData.title, formData.event_date);

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        event_date: '',
        max_participants: '8',
      });

      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      event_date: '',
      max_participants: '8',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Create Event
            {groupName && (
              <span className="text-sm font-normal text-gray-500">
                • {groupName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Weekend Climbing Session"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Event details, skill level, what to bring..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Climbing gym or outdoor location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event_date">Date & Time *</Label>
            <Input
              id="event_date"
              name="event_date"
              type="datetime-local"
              value={formData.event_date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_participants">Max Participants</Label>
            <Input
              id="max_participants"
              name="max_participants"
              type="number"
              min="1"
              max="50"
              value={formData.max_participants}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}