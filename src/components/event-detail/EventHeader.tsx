
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditEventDialog } from "@/components/admin/EditEventDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Event } from "@/types/events";

interface EventHeaderProps {
  event: Event;
  userJoined: boolean;
  user: any;
  onBack: () => void;
  onJoinEvent: () => void;
  onLeaveEvent: () => void;
  onEventUpdated?: () => void;
}

export function EventHeader({ 
  event, 
  userJoined, 
  user, 
  onBack, 
  onJoinEvent, 
  onLeaveEvent,
  onEventUpdated 
}: EventHeaderProps) {
  const { user: authUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authUser?.id) return;
      
      try {
        const { data: role } = await supabase.rpc('get_user_role', { _user_id: authUser.id });
        setIsAdmin(role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [authUser]);

  return (
    <div className="mb-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      {/* Event header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">{event.title}</h1>
            <div className="space-y-2">
              <div className="flex items-center text-stone-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center text-stone-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-stone-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.participants_count || 0} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 items-end">
            {isAdmin && onEventUpdated && (
              <EditEventDialog event={event} onEventUpdated={onEventUpdated} />
            )}
            
            {event.difficulty_level && (
              <Badge variant="outline">{event.difficulty_level}</Badge>
            )}
            
            {user && (
              <Button
                onClick={userJoined ? onLeaveEvent : onJoinEvent}
                variant={userJoined ? "outline" : "default"}
                className={userJoined ? "text-red-600 border-red-600 hover:bg-red-50" : "bg-[#E55A2B] hover:bg-[#D14B20]"}
              >
                {userJoined ? "Leave Event" : "Join Event"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
