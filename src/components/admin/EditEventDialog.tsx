
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { EventBasicInfo } from "./edit-event/EventBasicInfo";
import { EventDateTimeLocation } from "./edit-event/EventDateTimeLocation";
import { EventCapacitySettings } from "./edit-event/EventCapacitySettings";
import { EventDifficultySettings } from "./edit-event/EventDifficultySettings";

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

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants.toString()) : null,
        capacity_limit: formData.capacity_limit ? parseInt(formData.capacity_limit.toString()) : null,
        difficulty_level: formData.difficulty_level || null,
        required_climbing_level: formData.required_climbing_level === "none" || !formData.required_climbing_level ? null : formData.required_climbing_level,
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
          <EventBasicInfo formData={formData} onChange={handleFieldChange} />
          <EventDateTimeLocation formData={formData} onChange={handleFieldChange} />
          <EventCapacitySettings formData={formData} onChange={handleFieldChange} />
          <EventDifficultySettings formData={formData} onChange={handleFieldChange} />

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
