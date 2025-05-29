
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function EmptyEventsState() {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
        <p className="text-stone-600 mb-4">No upcoming events scheduled</p>
        <p className="text-sm text-stone-500">Check back later for new climbing adventures!</p>
      </CardContent>
    </Card>
  );
}
