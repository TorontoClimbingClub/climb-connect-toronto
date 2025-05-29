
import { CreateEventDialog } from "../CreateEventDialog";

interface CreateEventFormProps {
  showForm: boolean;
  onToggleForm: (show: boolean) => void;
  onEventCreated: () => void;
}

export function CreateEventForm({ showForm, onToggleForm, onEventCreated }: CreateEventFormProps) {
  if (!showForm) return null;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <CreateEventDialog
          showForm={true}
          onToggleForm={onToggleForm}
          onEventCreated={() => {
            onToggleForm(false);
            onEventCreated();
          }}
          hideButton={true}
        />
      </div>
    </div>
  );
}
