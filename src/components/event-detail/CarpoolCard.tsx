
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Car, Users, MapPin } from "lucide-react";
import { useState } from "react";

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
  carpool_driver_notes?: string | null;
  assigned_driver_id?: string | null;
}

interface CarpoolCardProps {
  participants: Participant[];
  currentUserId?: string;
  currentUserParticipation?: Participant;
  onUpdateCarpoolStatus: (isDriver: boolean, seats: number, notes?: string) => void;
  onAssignToDriver?: (driverId: string) => void;
}

export function CarpoolCard({ 
  participants, 
  currentUserId, 
  currentUserParticipation,
  onUpdateCarpoolStatus,
  onAssignToDriver
}: CarpoolCardProps) {
  const [isDriver, setIsDriver] = useState(currentUserParticipation?.is_carpool_driver || false);
  const [availableSeats, setAvailableSeats] = useState(currentUserParticipation?.available_seats || 1);
  const [driverNotes, setDriverNotes] = useState(currentUserParticipation?.carpool_driver_notes || '');

  const drivers = participants.filter(p => p.is_carpool_driver);
  const passengers = participants.filter(p => !p.is_carpool_driver && p.assigned_driver_id);
  const unassignedPassengers = participants.filter(p => !p.is_carpool_driver && !p.assigned_driver_id);
  const isUserJoined = !!currentUserParticipation;

  const handleCarpoolUpdate = () => {
    onUpdateCarpoolStatus(isDriver, availableSeats, isDriver ? driverNotes : undefined);
  };

  const getPassengersForDriver = (driverId: string) => {
    return passengers.filter(p => p.assigned_driver_id === driverId);
  };

  const getDriverSeatsUsed = (driver: Participant) => {
    return getPassengersForDriver(driver.user_id).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Carpool Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current user carpool settings */}
        {isUserJoined && (
          <div className="p-4 bg-orange-50 rounded-lg border">
            <h4 className="font-medium mb-3">Your Carpool Options</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="carpool-driver"
                  checked={isDriver}
                  onCheckedChange={setIsDriver}
                />
                <Label htmlFor="carpool-driver">I can offer rides for this event</Label>
              </div>
              
              {isDriver && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="seats">Available seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        min="1"
                        max="8"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="driver-notes">Pickup location/notes</Label>
                    <Textarea
                      id="driver-notes"
                      placeholder="e.g., Can pick up from downtown parking lot, highway 401 exit..."
                      value={driverNotes}
                      onChange={(e) => setDriverNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {!isDriver && drivers.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Request ride from:</Label>
                  <div className="mt-2 space-y-2">
                    {drivers.map(driver => {
                      const seatsUsed = getDriverSeatsUsed(driver);
                      const seatsAvailable = (driver.available_seats || 0) - seatsUsed;
                      const isAssigned = currentUserParticipation?.assigned_driver_id === driver.user_id;
                      
                      return (
                        <div key={driver.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <p className="font-medium">{driver.full_name}</p>
                            {driver.carpool_driver_notes && (
                              <p className="text-xs text-stone-600 mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {driver.carpool_driver_notes}
                              </p>
                            )}
                            <p className="text-xs text-stone-500">
                              {seatsAvailable} of {driver.available_seats} seats available
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isAssigned ? "default" : "outline"}
                            onClick={() => onAssignToDriver?.(driver.user_id)}
                            disabled={seatsAvailable === 0 && !isAssigned}
                          >
                            {isAssigned ? "Assigned" : seatsAvailable > 0 ? "Request" : "Full"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <Button onClick={handleCarpoolUpdate} size="sm" className="w-full">
                Update Carpool Status
              </Button>
            </div>
          </div>
        )}

        {/* Carpool Summary */}
        <div className="space-y-4">
          {/* Drivers with their passengers */}
          {drivers.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Drivers & Passengers
              </h4>
              <div className="space-y-3">
                {drivers.map(driver => {
                  const driverPassengers = getPassengersForDriver(driver.user_id);
                  const seatsUsed = driverPassengers.length;
                  const seatsAvailable = (driver.available_seats || 0) - seatsUsed;
                  
                  return (
                    <div key={driver.id} className="p-3 bg-stone-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-[#E55A2B]">{driver.full_name}</p>
                          {driver.carpool_driver_notes && (
                            <p className="text-sm text-stone-600 mt-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {driver.carpool_driver_notes}
                            </p>
                          )}
                        </div>
                        <Badge variant={seatsAvailable > 0 ? "secondary" : "outline"}>
                          {seatsUsed}/{driver.available_seats} seats
                        </Badge>
                      </div>
                      
                      {driverPassengers.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-stone-700 mb-1">Passengers:</p>
                          <div className="flex flex-wrap gap-1">
                            {driverPassengers.map(passenger => (
                              <Badge key={passenger.id} variant="outline" className="text-xs">
                                {passenger.full_name}
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

          {/* Unassigned passengers */}
          {unassignedPassengers.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Looking for rides:
              </h4>
              <div className="flex flex-wrap gap-2">
                {unassignedPassengers.map(passenger => (
                  <Badge key={passenger.id} variant="secondary" className="text-xs">
                    {passenger.full_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* No carpool activity */}
          {drivers.length === 0 && (
            <div className="text-center py-4 text-stone-600">
              <Car className="h-8 w-8 mx-auto mb-2 text-stone-400" />
              <p className="text-sm">No carpool drivers available yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
