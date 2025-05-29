
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
  needs_carpool?: boolean | null;
  assigned_driver_id?: string | null;
}

interface ParticipantsTableProps {
  participants: Participant[];
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const getCarpoolStatus = (participant: Participant) => {
    if (participant.is_carpool_driver) {
      return (
        <Badge variant="default">
          Driver ({participant.available_seats || 0} seats)
        </Badge>
      );
    } else if (participant.needs_carpool === false) {
      return (
        <Badge variant="outline">
          Own transport
        </Badge>
      );
    } else if (participant.assigned_driver_id) {
      return (
        <Badge variant="secondary">
          Assigned passenger
        </Badge>
      );
    } else if (participant.needs_carpool !== false) {
      return (
        <Badge variant="secondary">
          Looking for ride
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          Passenger
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants ({participants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Carpool</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    {participant.full_name}
                  </TableCell>
                  <TableCell>{participant.phone || 'Not provided'}</TableCell>
                  <TableCell>
                    {getCarpoolStatus(participant)}
                  </TableCell>
                  <TableCell>
                    {new Date(participant.joined_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-stone-600">
            No participants yet. Be the first to join!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
