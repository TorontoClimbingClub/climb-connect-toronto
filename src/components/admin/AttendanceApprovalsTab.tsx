
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Calendar, User, Clock, MapPin, Users } from "lucide-react";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AttendanceApprovalsTab() {
  const { approvals, loading, approveAttendance, rejectAttendance } = useAttendanceApprovals();
  const { events } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();
  const [joiningEvent, setJoiningEvent] = useState<string | null>(null);

  const isEventTimeReached = (eventDate: string, eventTime: string) => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    return new Date() >= eventDateTime;
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;
    
    setJoiningEvent(eventId);
    try {
      // Check if already joined
      const { data: existingParticipation } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingParticipation) {
        toast({
          title: "Already Joined",
          description: "You are already participating in this event",
        });
        return;
      }

      // Join the event
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully joined the event",
      });
    } catch (error: any) {
      console.error('Error joining event:', error);
      toast({
        title: "Error",
        description: "Failed to join event",
        variant: "destructive",
      });
    } finally {
      setJoiningEvent(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B]" />
      </div>
    );
  }

  const pendingApprovals = approvals.filter(approval => approval.status === 'pending');
  const processedApprovals = approvals.filter(approval => approval.status !== 'pending');

  // Get upcoming events for the event attendance section
  const upcomingEvents = events
    .filter(event => new Date(`${event.date}T${event.time}`) >= new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Event Attendance Management</h2>
        <p className="text-stone-600 mb-6">Review attendance approvals and track upcoming events.</p>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#E55A2B]">
          Upcoming Events ({upcomingEvents.length})
        </h3>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4">
            {upcomingEvents.map((event) => {
              const eventTimeReached = isEventTimeReached(event.date, event.time);
              const eventDateTime = new Date(`${event.date}T${event.time}`);
              
              return (
                <Card key={event.id} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#E55A2B]" />
                          <span className="font-medium text-lg">{event.title}</span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-stone-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{eventDateTime.toLocaleDateString()} at {eventDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>{event.participants_count || 0} participants</span>
                            {event.max_participants && (
                              <span>/ {event.max_participants} max</span>
                            )}
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-stone-700 mt-2">{event.description}</p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={!eventTimeReached || joiningEvent === event.id}
                          className={eventTimeReached ? "bg-green-600 hover:bg-green-700" : ""}
                          variant={eventTimeReached ? "default" : "outline"}
                        >
                          {joiningEvent === event.id ? (
                            "Joining..."
                          ) : eventTimeReached ? (
                            "Join Event"
                          ) : (
                            `Available at ${eventDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No upcoming events scheduled</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#E55A2B]">
          Pending Approvals ({pendingApprovals.length})
        </h3>
        
        {pendingApprovals.length > 0 ? (
          <div className="space-y-3">
            {pendingApprovals.map((approval: any) => {
              const getUserInitials = (name: string) => {
                return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              };

              return (
                <Card key={approval.id} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={approval.user?.profile_photo_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {getUserInitials(approval.user?.full_name || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{approval.user?.full_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Calendar className="h-3 w-3" />
                          <span>{approval.event?.title}</span>
                          <span>•</span>
                          <span>{new Date(approval.event?.date).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <Clock className="h-3 w-3" />
                          <span>Requested {new Date(approval.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => approveAttendance(approval.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectAttendance(approval.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No pending attendance approvals</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recently Processed */}
      {processedApprovals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-stone-700">
            Recently Processed ({processedApprovals.slice(0, 10).length})
          </h3>
          
          <div className="space-y-2">
            {processedApprovals.slice(0, 10).map((approval: any) => (
              <Card key={approval.id} className="border-stone-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{approval.user?.full_name}</span>
                      <span className="text-xs text-stone-500">{approval.event?.title}</span>
                    </div>
                    
                    <Badge 
                      variant={approval.status === 'approved' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {approval.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
