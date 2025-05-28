
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventActionsProps {
  userRole: string | null;
  onCreateEvent: () => void;
}

export function EventActions({ userRole, onCreateEvent }: EventActionsProps) {
  if (userRole !== 'admin') return null;

  return (
    <div className="mb-6">
      <Button 
        onClick={onCreateEvent}
        className="bg-[#E55A2B] hover:bg-[#D14B20] text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Event
      </Button>
    </div>
  );
}
