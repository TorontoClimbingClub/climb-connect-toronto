
import { Badge } from "@/components/ui/badge";

interface AttendanceBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  participantUserId: string;
  participantName: string;
}

export function AttendanceBadge({ status, participantUserId, participantName }: AttendanceBadgeProps) {
  console.log(`🏷️ [BADGE] User ${participantName} status: ${status}`);
  
  switch (status) {
    case 'approved':
      return (
        <Badge key={`${participantUserId}-approved`} variant="default" className="text-xs bg-green-600 text-white">
          Confirmed
        </Badge>
      );
    case 'rejected':
      return (
        <Badge key={`${participantUserId}-rejected`} variant="destructive" className="text-xs bg-red-600 text-white">
          Not Present
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge key={`${participantUserId}-pending`} variant="secondary" className="text-xs bg-gray-500 text-white">
          Pending
        </Badge>
      );
  }
}
