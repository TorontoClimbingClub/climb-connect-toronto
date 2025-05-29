
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EventsAttendanceHeaderProps {
  canCreateEvents: boolean;
  showCreateForm: boolean;
  onToggleCreateForm: (show: boolean) => void;
}

export function EventsAttendanceHeader({ 
  canCreateEvents, 
  showCreateForm, 
  onToggleCreateForm 
}: EventsAttendanceHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-emerald-800">Events & Attendance Management</h2>
        <p className="text-stone-600">Manage events and confirm member attendance</p>
      </div>
      {canCreateEvents && !showCreateForm && (
        <Button 
          onClick={() => onToggleCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      )}
    </div>
  );
}
