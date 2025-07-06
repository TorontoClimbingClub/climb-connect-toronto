import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Calendar } from 'lucide-react';

interface ChatActionsMenuProps {
  onCreateEvent: () => void;
}

export function ChatActionsMenu({ onCreateEvent }: ChatActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateEvent = () => {
    onCreateEvent();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 z-10"
        >
          <Plus className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={handleCreateEvent}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="h-4 w-4" />
          Create Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}