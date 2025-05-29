
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, User, Clock } from "lucide-react";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";

export function AttendanceApprovalsTab() {
  const { approvals, loading, approveAttendance, rejectAttendance } = useAttendanceApprovals();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B]" />
      </div>
    );
  }

  const pendingApprovals = approvals.filter(approval => approval.status === 'pending');
  const processedApprovals = approvals.filter(approval => approval.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">Event Attendance Approvals</h2>
        <p className="text-stone-600 mb-6">Review and approve event attendance to award badges automatically.</p>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#E55A2B]">
          Pending Approvals ({pendingApprovals.length})
        </h3>
        
        {pendingApprovals.length > 0 ? (
          <div className="space-y-3">
            {pendingApprovals.map((approval: any) => (
              <Card key={approval.id} className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#E55A2B]" />
                        <span className="font-medium">{approval.user?.full_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Calendar className="h-3 w-3" />
                        <span>{approval.event?.title}</span>
                        <span>•</span>
                        <span>{new Date(approval.event?.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Clock className="h-3 w-3" />
                        <span>Requested {new Date(approval.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => approveAttendance(approval.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectAttendance(approval.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No pending attendance approvals</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recently Processed */}
      {processedApprovals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-stone-700">
            Recently Processed ({processedApprovals.slice(0, 10).length})
          </h3>
          
          <div className="space-y-2">
            {processedApprovals.slice(0, 10).map((approval: any) => (
              <Card key={approval.id} className="border-stone-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{approval.user?.full_name}</span>
                      <span className="text-xs text-stone-500">{approval.event?.title}</span>
                    </div>
                    
                    <Badge 
                      variant={approval.status === 'approved' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {approval.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
