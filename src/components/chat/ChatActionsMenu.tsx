import React from 'react';
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
  className?: string;
}

export const ChatActionsMenu: React.FC<ChatActionsMenuProps> = ({
  onCreateEvent,
  className = ""
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`flex-shrink-0 ${className}`}
          type="button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={onCreateEvent}>
          <Calendar className="mr-2 h-4 w-4" />
          Create Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};