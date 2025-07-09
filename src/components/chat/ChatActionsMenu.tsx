import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Calendar, LogOut, Trash2 } from 'lucide-react';

interface ChatActionsMenuProps {
  onCreateEvent: () => void;
  onLeave?: () => void;
  leaveText?: string;
  className?: string;
  isAdmin?: boolean;
  onDeleteMessages?: () => void;
  isDeleteMode?: boolean;
}

export const ChatActionsMenu: React.FC<ChatActionsMenuProps> = ({
  onCreateEvent,
  onLeave,
  leaveText,
  className = "",
  isAdmin = false,
  onDeleteMessages,
  isDeleteMode = false
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
      <DropdownMenuContent align="start" side="top" className="w-48">
        <DropdownMenuItem onClick={onCreateEvent}>
          <Calendar className="mr-2 h-4 w-4" />
          Create Event
        </DropdownMenuItem>
        {isAdmin && onDeleteMessages && (
          <DropdownMenuItem onClick={onDeleteMessages} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleteMode ? 'Cancel Delete' : 'Delete Messages'}
          </DropdownMenuItem>
        )}
        {onLeave && (
          <DropdownMenuItem onClick={onLeave} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            {leaveText || 'Leave'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};