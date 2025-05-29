
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CreateEventDialogProps {
  showForm: boolean;
  onToggleForm: (show: boolean) => void;
  onEventCreated: () => void;
  hideButton?: boolean;
}

export function CreateEventDialog({ showForm, onToggleForm, onEventCreated, hideButton = false }: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    date: "",
    time: "",
    end_time: "",
    location: "",
    max_participants: "",
    difficulty_level: "",
    required_climbing_level: "",
    required_climbing_experience: [] as string[],
    capacity_limit: ""
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        details: formData.details || null,
        date: formData.date,
        time: formData.time,
        end_time: formData.end_time || null,
        location: formData.location,
        organizer_id: user.id,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        difficulty_level: formData.difficulty_level || null,
        required_climbing_level: formData.required_climbing_level === "none" || !formData.required_climbing_level ? null : formData.required_climbing_level,
        required_climbing_experience: formData.required_climbing_experience.length > 0 ? formData.required_climbing_experience : null,
        capacity_limit: formData.capacity_limit ? parseInt(formData.capacity_limit) : null
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        details: "",
        date: "",
        time: "",
        end_time: "",
        location: "",
        max_participants: "",
        difficulty_level: "",
        required_climbing_level: "",
        required_climbing_experience: [],
        capacity_limit: ""
      });

      onEventCreated();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      title: "",
      description: "",
      details: "",
      date: "",
      time: "",
      end_time: "",
      location: "",
      max_participants: "",
      difficulty_level: "",
      required_climbing_level: "",
      required_climbing_experience: [],
      capacity_limit: ""
    });
    onToggleForm(false);
  };

  if (hideButton) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#E55A2B]">Create New Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Event name"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Event location"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief event description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Detailed event information, what to bring, etc."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Start Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', e.target.value)}
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="capacity_limit">Capacity Limit</Label>
              <Input
                id="capacity_limit"
                type="number"
                value={formData.capacity_limit}
                onChange={(e) => handleInputChange('capacity_limit', e.target.value)}
                placeholder="Total capacity including organizers"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select value={formData.difficulty_level} onValueChange={(value) => handleInputChange('difficulty_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="required_climbing_level">Required Climbing Level</Label>
              <Select value={formData.required_climbing_level} onValueChange={(value) => handleInputChange('required_climbing_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select required level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No requirement</SelectItem>
                  <SelectItem value="Never Climbed">Never Climbed</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#E55A2B] hover:bg-[#D14B20]">
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Dialog open={showForm} onOpenChange={onToggleForm}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form content same as above */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
