
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Car, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
  participants_count?: number;
  carpool_seats?: number;
  equipment_count?: number;
}

interface EventCardProps {
  event: Event;
  showJoinButton?: boolean;
  userJoined?: boolean;
  onJoin?: () => void;
  isLoading?: boolean;
}

export function EventCard({ 
  event, 
  showJoinButton = false, 
  userJoined = false, 
  onJoin,
  isLoading = false 
}: EventCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-[#E55A2B]">{event.title}</CardTitle>
            {event.description && (
              <CardDescription className="mt-1">{event.description}</CardDescription>
            )}
          </div>
          {event.difficulty_level && (
            <Badge variant="outline" className="ml-2">
              {event.difficulty_level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-stone-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          
          <div className="flex items-center text-stone-600">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>

          <div className="flex items-center text-stone-600">
            <Users className="h-4 w-4 mr-2" />
            {event.participants_count || 0} participants
            {event.max_participants && ` / ${event.max_participants} max`}
          </div>
        </div>

        {/* Carpool and Equipment Stats */}
        <div className="flex gap-2">
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
            <Car className="h-3 w-3 mr-1" />
            {event.carpool_seats || 0} seats
          </div>
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
            <Package className="h-3 w-3 mr-1" />
            {event.equipment_count || 0} gear
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            className="flex-1"
          >
            View Details
          </Button>
          
          {showJoinButton && (
            <Button 
              onClick={onJoin}
              disabled={userJoined || isLoading}
              className="flex-1 bg-[#E55A2B] hover:bg-[#D14B20] text-white"
            >
              {userJoined ? "Joined" : isLoading ? "Joining..." : "Join Event"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
