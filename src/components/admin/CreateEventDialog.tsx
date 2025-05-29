import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  details: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  max_participants: z.number().min(1).optional(),
  climbing_level: z.string().optional(),
  required_climbing_level: z.string().optional(),
});

interface CreateEventDialogProps {
  showForm: boolean;
  onToggleForm: (show: boolean) => void;
  onEventCreated: () => void;
  hideButton?: boolean;
}

const CLIMBING_LEVELS = ['Never Climbed', 'Beginner', 'Intermediate', 'Advanced'];
const CLIMBING_EXPERIENCES = [
  'Top Rope',
  'Top Rope Belay', 
  'Lead',
  'Lead Belay',
  'Cleaning',
  'Anchor Building',
  'Rappelling'
];

export function CreateEventDialog({ showForm, onToggleForm, onEventCreated, hideButton = false }: CreateEventDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requiredExperience, setRequiredExperience] = useState<string[]>([]);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      details: "",
      date: "",
      time: "",
      location: "",
      max_participants: undefined,
      climbing_level: "",
      required_climbing_level: "",
    },
  });

  const onSubmitEvent = async (values: z.infer<typeof eventSchema>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: values.title,
          description: values.description || null,
          details: values.details || null,
          date: values.date,
          time: values.time,
          location: values.location,
          max_participants: values.max_participants || null,
          difficulty_level: values.climbing_level || null,
          required_climbing_level: values.required_climbing_level || null,
          capacity_limit: values.max_participants || null,
          required_climbing_experience: requiredExperience.length > 0 ? requiredExperience : null,
          organizer_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event created successfully",
      });

      form.reset();
      setRequiredExperience([]);
      onToggleForm(false);
      onEventCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleExperienceChange = (experience: string, checked: boolean) => {
    if (checked) {
      setRequiredExperience(prev => [...prev, experience]);
    } else {
      setRequiredExperience(prev => prev.filter(exp => exp !== experience));
    }
  };

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitEvent)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rattlesnake Point Climbing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief event summary..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional event details, what to bring, meeting instructions..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rattlesnake Point, Milton, ON" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="climbing_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Climbing Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select climbing level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLIMBING_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                  <SelectItem value="All Levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="required_climbing_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Climbing Level (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Minimum climbing level required" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLIMBING_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Required Climbing Experience (Optional)</FormLabel>
          <div className="grid grid-cols-2 gap-3 mt-2 border rounded-md p-3">
            {CLIMBING_EXPERIENCES.map((experience) => (
              <div key={experience} className="flex items-center space-x-2">
                <Checkbox
                  id={`exp-${experience}`}
                  checked={requiredExperience.includes(experience)}
                  onCheckedChange={(checked) => 
                    handleExperienceChange(experience, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`exp-${experience}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {experience}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Participants must have at least one of these experiences
          </p>
        </div>

        <FormField
          control={form.control}
          name="max_participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Participants</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Leave empty for unlimited"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
          Create Event
        </Button>
      </form>
    </Form>
  );

  if (hideButton && showForm) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Climbing Event</CardTitle>
          <CardDescription>
            Add a new outdoor climbing event for TCC members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Button 
        onClick={() => onToggleForm(!showForm)}
        className={`${showForm ? 'bg-stone-500 hover:bg-stone-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
      >
        {showForm ? (
          <>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </>
        )}
      </Button>

      {showForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New Climbing Event</CardTitle>
            <CardDescription>
              Add a new outdoor climbing event for TCC members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormContent />
          </CardContent>
        </Card>
      )}
    </>
  );
}
