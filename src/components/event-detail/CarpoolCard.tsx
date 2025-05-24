
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Car } from "lucide-react";
import { useState } from "react";

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
}

interface CarpoolCardProps {
  participants: Participant[];
  currentUserId?: string;
  currentUserParticipation?: Participant;
  onUpdateCarpoolStatus: (isDriver: boolean, seats: number) => void;
}

export function CarpoolCard({ 
  participants, 
  currentUserId, 
  currentUserParticipation,
  onUpdateCarpoolStatus 
}: CarpoolCardProps) {
  const [isDriver, setIsDriver] = useState(currentUserParticipation?.is_carpool_driver || false);
  const [availableSeats, setAvailableSeats] = useState(currentUserParticipation?.available_seats || 1);

  const drivers = participants.filter(p => p.is_carpool_driver);
  const isUserJoined = !!currentUserParticipation;

  const handleCarpoolUpdate = () => {
    onUpdateCarpoolStatus(isDriver, availableSeats);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Carpool Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current user carpool settings */}
        {isUserJoined && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <h4 className="font-medium mb-3">Your Carpool Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="carpool-driver"
                  checked={isDriver}
                  onCheckedChange={setIsDriver}
                />
                <Label htmlFor="carpool-driver">I can offer rides for this event</Label>
              </div>
              
              {isDriver && (
                <div className="space-y-2">
                  <Label htmlFor="seats">Available seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="8"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </div>
              )}
              
              <Button onClick={handleCarpoolUpdate} size="sm">
                Update Carpool Status
              </Button>
            </div>
          </div>
        )}

        {/* Available drivers */}
        <div className="text-sm text-stone-600">
          {drivers.length > 0 ? (
            <div>
              <p className="font-medium mb-2">Available drivers:</p>
              {drivers.map(driver => (
                <div key={driver.id} className="flex justify-between items-center py-1">
                  <span>{driver.full_name}</span>
                  <Badge variant="secondary">
                    {driver.available_seats || 0} seats
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p>No carpool drivers available yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
