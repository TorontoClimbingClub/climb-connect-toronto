
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Users, MapPin, UserCheck, UserX } from "lucide-react";
import { Participant } from "@/types/events";

interface CarpoolCardProps {
  participants: Participant[];
  currentUserId?: string;
  currentUserParticipation: Participant | null;
  onUpdateCarpoolStatus: (isDriver: boolean, seats: number, notes?: string) => void;
  onAssignToDriver: (driverId: string) => void;
  onUpdateCarpoolPreference?: (needsCarpool: boolean) => void;
}

export function CarpoolCard({ 
  participants, 
  currentUserId, 
  currentUserParticipation,
  onUpdateCarpoolStatus,
  onAssignToDriver,
  onUpdateCarpoolPreference
}: CarpoolCardProps) {
  const [isDriver, setIsDriver] = useState(currentUserParticipation?.is_carpool_driver || false);
  const [seats, setSeats] = useState(currentUserParticipation?.available_seats || 2);
  const [notes, setNotes] = useState(currentUserParticipation?.carpool_driver_notes || "");
  const [needsCarpool, setNeedsCarpool] = useState(currentUserParticipation?.needs_carpool ?? true);

  const drivers = participants.filter(p => p.is_carpool_driver && p.available_seats && p.available_seats > 0);
  const needingRides = participants.filter(p => 
    !p.is_carpool_driver && 
    !p.assigned_driver_id && 
    p.needs_carpool !== false &&
    p.user_id !== currentUserId
  );

  const handleDriverStatusChange = (checked: boolean) => {
    setIsDriver(checked);
    onUpdateCarpoolStatus(checked, seats, notes);
  };

  const handleSeatsChange = (newSeats: number) => {
    setSeats(newSeats);
    if (isDriver) {
      onUpdateCarpoolStatus(true, newSeats, notes);
    }
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    if (isDriver) {
      onUpdateCarpoolStatus(true, seats, newNotes);
    }
  };

  const handleCarpoolPreferenceChange = (needsRide: boolean) => {
    setNeedsCarpool(needsRide);
    if (onUpdateCarpoolPreference) {
      onUpdateCarpoolPreference(needsRide);
    }
  };

  const handleJoinCarpool = (driverId: string) => {
    onAssignToDriver(driverId);
  };

  const handleLeaveCarpool = () => {
    onAssignToDriver("");
  };

  const getAssignedPassengers = (driverId: string) => {
    return participants.filter(p => p.assigned_driver_id === driverId);
  };

  const isCurrentUserAssignedToDriver = (driverId: string) => {
    return currentUserParticipation?.assigned_driver_id === driverId;
  };

  const getRemainingSeats = (driver: Participant) => {
    const assignedPassengers = getAssignedPassengers(driver.user_id);
    return (driver.available_seats || 0) - assignedPassengers.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Drivers & Passengers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current user carpool options */}
        {currentUserId && currentUserParticipation && (
          <div className="bg-stone-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Your Carpool Options</h4>
            
            <div className="space-y-4">
              {/* Driver option */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="driver"
                  checked={isDriver}
                  onCheckedChange={handleDriverStatusChange}
                />
                <div className="flex-1">
                  <label htmlFor="driver" className="text-sm font-medium cursor-pointer">
                    I can offer rides for this event
                  </label>
                  
                  {isDriver && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-sm text-stone-600 mb-1 block">Available seats</label>
                        <Input
                          type="number"
                          min="1"
                          max="8"
                          value={seats}
                          onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-stone-600 mb-1 block">Pickup location / Notes</label>
                        <Textarea
                          placeholder="e.g., Downtown Toronto, prefer highway routes..."
                          value={notes}
                          onChange={(e) => handleNotesChange(e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Passenger option */}
              {!isDriver && (
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="needs-carpool"
                    checked={needsCarpool}
                    onCheckedChange={handleCarpoolPreferenceChange}
                  />
                  <div className="flex-1">
                    <label htmlFor="needs-carpool" className="text-sm font-medium cursor-pointer">
                      I need a ride to this event
                    </label>
                    <p className="text-xs text-stone-500 mt-1">
                      Uncheck this if you have your own transportation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available drivers */}
        {drivers.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Available Drivers ({drivers.length})
            </h4>
            <div className="space-y-3">
              {drivers.map((driver) => {
                const assignedPassengers = getAssignedPassengers(driver.user_id);
                const remainingSeats = getRemainingSeats(driver);
                const isCurrentUserAssigned = isCurrentUserAssignedToDriver(driver.user_id);
                
                return (
                  <div key={driver.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{driver.full_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {remainingSeats} seat{remainingSeats !== 1 ? 's' : ''} available
                          </Badge>
                          {driver.user_id === currentUserId && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        {driver.phone && (
                          <p className="text-sm text-stone-600">{driver.phone}</p>
                        )}
                        {driver.carpool_driver_notes && (
                          <div className="flex items-start gap-1 mt-1">
                            <MapPin className="h-3 w-3 mt-0.5 text-stone-500 flex-shrink-0" />
                            <p className="text-xs text-stone-600">{driver.carpool_driver_notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {currentUserId && currentUserId !== driver.user_id && remainingSeats > 0 && !isCurrentUserAssigned && currentUserParticipation && needsCarpool && (
                        <Button
                          onClick={() => handleJoinCarpool(driver.user_id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      
                      {isCurrentUserAssigned && (
                        <Button
                          onClick={handleLeaveCarpool}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Leave
                        </Button>
                      )}
                    </div>
                    
                    {assignedPassengers.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs font-medium text-stone-600 mb-1">Passengers:</p>
                        <div className="flex flex-wrap gap-1">
                          {assignedPassengers.map((passenger) => (
                            <Badge key={passenger.id} variant="outline" className="text-xs">
                              {passenger.full_name}
                              {passenger.user_id === currentUserId && " (You)"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* People looking for rides */}
        {needingRides.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Looking for Rides ({needingRides.length})
            </h4>
            <div className="space-y-2">
              {needingRides.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <div>
                    <span className="font-medium">{participant.full_name}</span>
                    {participant.phone && (
                      <span className="text-sm text-stone-600 ml-2">{participant.phone}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {drivers.length === 0 && needingRides.length === 0 && (
          <div className="text-center py-8 text-stone-500">
            <Car className="h-12 w-12 mx-auto mb-4 text-stone-400" />
            <p>No carpool arrangements yet</p>
            <p className="text-sm mt-1">Be the first to offer a ride or request one!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
