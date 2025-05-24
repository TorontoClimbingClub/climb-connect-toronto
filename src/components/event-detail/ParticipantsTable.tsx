
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
}

interface ParticipantsTableProps {
  participants: Participant[];
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Participants ({participants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">Phone</TableHead>
                  <TableHead className="text-xs sm:text-sm">Carpool</TableHead>
                  <TableHead className="text-xs sm:text-sm">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium text-xs sm:text-sm break-words max-w-[120px] sm:max-w-none">
                      {participant.full_name}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm break-words max-w-[120px] sm:max-w-none">
                      {participant.phone || 'Not provided'}
                    </TableCell>
                    <TableCell>
                      {participant.is_carpool_driver ? (
                        <Badge variant="default" className="text-xs">
                          Driver ({participant.available_seats || 0} seats)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Passenger</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {new Date(participant.joined_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-stone-600">
            <p className="text-sm sm:text-base">No participants yet. Be the first to join!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
