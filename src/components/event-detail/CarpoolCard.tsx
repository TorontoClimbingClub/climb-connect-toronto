
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

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
}

export function CarpoolCard({ participants }: CarpoolCardProps) {
  const drivers = participants.filter(p => p.is_carpool_driver);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Carpool Options
        </CardTitle>
      </CardHeader>
      <CardContent>
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
