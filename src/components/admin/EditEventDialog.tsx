import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";

interface EditEventDialogProps {
  event: Event;
  onEventUpdated: () => void;
}

export function EditEventDialog({ event, onEventUpdated }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || "",
    details: (event as any).details || "",
    date: event.date,
    time: event.time,
    location: event.location,
    max_participants: event.max_participants || "",
    difficulty_level: event.difficulty_level || "",
    required_climbing_level: event.required_climbing_level || "",
    required_climbing_experience: event.required_climbing_experience || [],
    capacity_limit: event.capacity_limit || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants.toString()) : null,
        capacity_limit: formData.capacity_limit ? parseInt(formData.capacity_limit.toString()) : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      setOpen(false);
      onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const climbingExperiences = [
    "Top Rope",
    "Sport Climbing", 
    "Traditional Climbing",
    "Bouldering",
    "Multi-pitch",
    "Ice Climbing",
    "Alpine Climbing"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief event summary..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Additional event details, what to bring, meeting instructions..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Event location"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                  placeholder="No limit"
                />
              </div>
              <div>
                <Label htmlFor="capacity_limit">Capacity Limit</Label>
                <Input
                  id="capacity_limit"
                  type="number"
                  min="1"
                  value={formData.capacity_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity_limit: e.target.value }))}
                  placeholder="No limit"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select value={formData.difficulty_level} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No difficulty level</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="required_climbing_level">Required Climbing Level</Label>
              <Select value={formData.required_climbing_level} onValueChange={(value) => setFormData(prev => ({ ...prev, required_climbing_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select required climbing level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No requirement</SelectItem>
                  <SelectItem value="Never Climbed">Never Climbed</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#E55A2B] hover:bg-[#D14B20]">
              {loading ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
