
import { Card, CardContent } from "@/components/ui/card";

export function EmptyEventsState() {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-stone-600">No events found</p>
      </CardContent>
    </Card>
  );
}
