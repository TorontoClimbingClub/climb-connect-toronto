
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Calendar, User, Clock, MapPin, Users } from "lucide-react";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

export function AttendanceApprovalsTab() {
  const { approvals, loading: approvalsLoading, approveAttendance, rejectAttendance } = useAttendanceApprovals();
  const { upcomingEvents, loading: eventsLoading } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();
  const [eventsWithParticipants, setEventsWithParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventsWithParticipants = async () => {
    try {
      // Get all events (past and upcoming) sorted by date
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (eventsError) throw eventsError;

      // For each event, get participants and their attendance status
      const eventsWithParticipantsData = await Promise.all(
        (events || []).map(async (event) => {
          // Get participants
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

          // Get attendance approvals for this event
          const eventApprovals = approvals.filter(approval => approval.event_id === event.id);

          // Map participants with their attendance status
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

  useEffect(() => {
    if (!approvalsLoading) {
      fetchEventsWithParticipants();
    }
  }, [approvals, approvalsLoading]);

  const handleConfirmAttendance = async (participantUserId: string, eventId: string) => {
    try {
      // Check if approval already exists
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        await approveAttendance(existingApproval.id);
      } else {
        // Create new approval record
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

      // Refresh data
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
        // Create new rejection record
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

      // Refresh data
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

  if (loading || approvalsLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B]" />
      </div>
    );
  }

  // Separate events into upcoming and past
  const upcomingEventsWithParticipants = eventsWithParticipants.filter(event => !event.has_ended);
  const pastEventsWithParticipants = eventsWithParticipants.filter(event => event.has_ended);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Event Attendance Confirmation</h2>
        <p className="text-stone-600 mb-6">Confirm attendance for participants after events have concluded to track member participation.</p>
      </div>

      {/* Past Events - Ready for Attendance Confirmation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#E55A2B]">
          Past Events - Confirm Attendance ({pastEventsWithParticipants.length})
        </h3>
        
        {pastEventsWithParticipants.length > 0 ? (
          <div className="space-y-4">
            {pastEventsWithParticipants.slice(0, 10).map((event) => (
              <Card key={event.id} className="border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#E55A2B]" />
                        {event.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-stone-600 mt-1">
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
                    <Badge variant="outline" className="text-green-700 border-green-700">
                      Event Ended
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
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
                          
                          {participant.attendance_status === 'pending' && (
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No past events requiring attendance confirmation</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Events - Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-stone-700">
          Upcoming Events - Preview ({upcomingEventsWithParticipants.length})
        </h3>
        
        {upcomingEventsWithParticipants.length > 0 ? (
          <div className="space-y-3">
            {upcomingEventsWithParticipants.slice(0, 5).map((event) => (
              <Card key={event.id} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#E55A2B]" />
                        <span className="font-medium">{event.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.event_date_time.toLocaleDateString()} at {event.event_date_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{event.participants_count} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-blue-700 border-blue-700">
                      Upcoming
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No upcoming events scheduled</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
