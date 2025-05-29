
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";

interface AttendanceButtonsProps {
  status: 'pending' | 'approved' | 'rejected';
  participantName: string;
  isUpdating: boolean;
  onConfirm: () => void;
  onReject: () => void;
  onReset?: () => void;
}

export function AttendanceButtons({
  status,
  participantName,
  isUpdating,
  onConfirm,
  onReject,
  onReset
}: AttendanceButtonsProps) {
  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  console.log(`🔘 [BUTTONS] User ${participantName} - Pending: ${isPending}, Approved: ${isApproved}, Rejected: ${isRejected}`);

  return (
    <div className="flex gap-2">
      {isPending && (
        <>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Not Present
          </Button>
        </>
      )}
      
      {(isApproved || isRejected) && onReset && (
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={isUpdating}
          className="text-gray-600 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
      
      {isRejected && (
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={isUpdating}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-1" />
          Confirm
        </Button>
      )}
      
      {isApproved && (
        <Button
          size="sm"
          variant="outline"
          onClick={onReject}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4 mr-1" />
          Not Present
        </Button>
      )}
    </div>
  );
}
