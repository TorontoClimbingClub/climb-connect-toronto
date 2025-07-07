import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Edit, Pin, Flag } from 'lucide-react';

interface AdminControlsProps {
  messageId: string;
  isAdmin: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canPin?: boolean;
  canFlag?: boolean;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onFlag?: (messageId: string) => void;
  className?: string;
}

export function AdminControls({
  messageId,
  isAdmin,
  canDelete = false,
  canEdit = false,
  canPin = false,
  canFlag = false,
  onDelete,
  onEdit,
  onPin,
  onFlag,
  className = ''
}: AdminControlsProps) {
  if (!isAdmin || (!canDelete && !canEdit && !canPin && !canFlag)) {
    return null;
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(messageId);
    }
  };

  const handlePin = () => {
    if (onPin) {
      onPin(messageId);
    }
  };

  const handleFlag = () => {
    if (onFlag) {
      onFlag(messageId);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {canEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
          title="Edit message (Admin)"
        >
          <Edit className="h-3 w-3" />
        </Button>
      )}
      
      {canPin && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePin}
          className="h-6 w-6 p-0 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
          title="Pin message (Admin)"
        >
          <Pin className="h-3 w-3" />
        </Button>
      )}
      
      {canFlag && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleFlag}
          className="h-6 w-6 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
          title="Flag message (Admin)"
        >
          <Flag className="h-3 w-3" />
        </Button>
      )}
      
      {canDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Delete message (Admin)"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}