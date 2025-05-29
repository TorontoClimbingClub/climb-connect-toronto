
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2, Calendar, MapPin, Users, Edit, Check, X, Clock } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/events";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

interface CombinedEventsAttendanceTabProps {
  events: Event[];
  canCreateEvents: boolean;
  canManageUsers: boolean;
  onDeleteEvent: (eventId: string) => void;
  onRefreshEvents: () => void;
}

export function CombinedEventsAttendanceTab({ 
  events, 
  canCreateEvents, 
  canManageUsers, 
  onDeleteEvent, 
  onRefreshEvents 
}: CombinedEventsAttendanceTabProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [eventsWithParticipants, setEventsWithParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { approvals, approveAttendance, rejectAttendance } = useAttendanceApprovals();
  const { toast } = useToast();

  const fetchEventsWithParticipants = async () => {
    setLoading(true);
    try {
      const eventsWithParticipantsData = await Promise.all(
        events.map(async (event) => {
          const { data: participants, error: participantsError } = await supabase
            .from('event_participants')
            .select(`
              id,
              user_id,
              profiles!inner(
                full_name,
                profile_photo_url
              )
            `)
            .eq('event_id', event.id);

          if (participantsError) throw participantsError;

          const eventApprovals = approvals.filter(approval => approval.event_id === event.id);

          const participantsWithStatus = participants?.map(participant => {
            const approval = eventApprovals.find(a => a.user_id === participant.user_id);
            return {
              id: participant.id,
              user_id: participant.user_id,
              full_name: participant.profiles.full_name,
              profile_photo_url: participant.profiles.profile_photo_url,
              attendance_status: approval?.status || 'pending',
              approval_id: approval?.id
            };
          }) || [];

          const eventDateTime = new Date(`${event.date}T${event.time}`);
          const hasEnded = new Date() > eventDateTime;

          return {
            ...event,
            participants: participantsWithStatus,
            participants_count: participantsWithStatus.length,
            has_ended: hasEnded,
            event_date_time: eventDateTime
          };
        })
      );

      setEventsWithParticipants(eventsWithParticipantsData);
    } catch (error: any) {
      console.error('Error fetching events with participants:', error);
      toast({
        title: "Error",
        description: "Failed to load events and participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttendance = async (participantUserId: string, eventId: string) => {
    try {
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        await approveAttendance(existingApproval.id);
      } else {
        const { error } = await supabase
          .from('event_attendance_approvals')
          .insert({
            user_id: participantUserId,
            event_id: eventId,
            status: 'approved',
            approved_at: new Date().toISOString()
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Attendance confirmed successfully",
        });
      }

      await fetchEventsWithParticipants();
    } catch (error: any) {
      console.error('Error confirming attendance:', error);
      toast({
        title: "Error",
        description: "Failed to confirm attendance",
        variant: "destructive",
      });
    }
  };

  const handleRejectAttendance = async (participantUserId: string, eventId: string) => {
    try {
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        await rejectAttendance(existingApproval.id);
      } else {
        const { error } = await supabase
          .from('event_attendance_approvals')
          .insert({
            user_id: participantUserId,
            event_id: eventId,
            status: 'rejected'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Attendance marked as not present",
        });
      }

      await fetchEventsWithParticipants();
    } catch (error: any) {
      console.error('Error rejecting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Load events with participants when component mounts or approvals change
  React.useEffect(() => {
    if (events.length > 0) {
      fetchEventsWithParticipants();
    }
  }, [events, approvals]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-emerald-800">Events & Attendance Management</h2>
          <p className="text-stone-600">Manage events and confirm member attendance</p>
        </div>
        {canCreateEvents && !showCreateForm && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {showCreateForm && (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <CreateEventDialog
              showForm={true}
              onToggleForm={setShowCreateForm}
              onEventCreated={() => {
                setShowCreateForm(false);
                onRefreshEvents();
              }}
              hideButton={true}
            />
          </div>
        </div>
      )}

      {!showCreateForm && (
        <div className="space-y-4">
          {eventsWithParticipants.map((event) => (
            <Card key={event.id} className={`w-full ${event.has_ended ? 'border-green-200' : 'border-blue-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-[#E55A2B]" />
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="outline" className={event.has_ended ? "text-green-700 border-green-700" : "text-blue-700 border-blue-700"}>
                        {event.has_ended ? 'Event Ended' : 'Upcoming'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-stone-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.event_date_time.toLocaleDateString()} at {event.event_date_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {canManageUsers && (
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <EditEventDialog 
                        event={event} 
                        onEventUpdated={onRefreshEvents}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {event.description && (
                    <p className="text-sm text-stone-600">{event.description}</p>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participants ({event.participants_count})
                    </h4>
                    
                    {event.participants.length > 0 ? (
                      <div className="space-y-2">
                        {event.participants.map((participant: EventParticipant) => (
                          <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.profile_photo_url || undefined} />
                                <AvatarFallback className="text-xs">
                                  {getUserInitials(participant.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{participant.full_name}</span>
                              {participant.attendance_status !== 'pending' && (
                                <Badge 
                                  variant={participant.attendance_status === 'approved' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {participant.attendance_status === 'approved' ? 'Confirmed' : 'Not Present'}
                                </Badge>
                              )}
                            </div>
                            
                            {event.has_ended && participant.attendance_status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmAttendance(participant.user_id, event.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectAttendance(participant.user_id, event.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Not Present
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-500 text-sm">No participants registered for this event</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {events.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-stone-600">No events found</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
