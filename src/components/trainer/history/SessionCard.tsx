
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, Mountain, Target, Trash2 } from 'lucide-react';

interface SessionCardProps {
  session: any;
  onDelete: (sessionId: string) => void;
}

const SessionCard = ({ session, onDelete }: SessionCardProps) => {
  const formatSessionDuration = (session: any) => {
    if (!session.startTime || !session.endTime) return 'N/A';
    const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
    const minutes = Math.round(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const getMaxGrade = (climbs: any[]) => {
    if (climbs.length === 0) return 'N/A';
    const grades = climbs.map(c => c.routeGrade).filter(Boolean);
    if (grades.length === 0) return 'N/A';
    
    // Simple grade comparison (works for 5.x format)
    return grades.sort((a, b) => {
      const aNum = parseFloat(a.replace('5.', ''));
      const bNum = parseFloat(b.replace('5.', ''));
      return bNum - aNum;
    })[0];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {new Date(session.sessionDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <p className="text-gray-600">{session.sessionGoal}</p>
            {session.customGoal && session.sessionGoal !== session.customGoal && (
              <p className="text-sm text-gray-500 italic">{session.customGoal}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatSessionDuration(session)}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Training Session</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this training session? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(session.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Mountain className="h-5 w-5 mx-auto mb-1 text-[#E55A2B]" />
            <p className="text-2xl font-bold">{session.climbs.length}</p>
            <p className="text-sm text-gray-600">Climbs</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Target className="h-5 w-5 mx-auto mb-1 text-[#E55A2B]" />
            <p className="text-2xl font-bold">{getMaxGrade(session.climbs)}</p>
            <p className="text-sm text-gray-600">Max Grade</p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold">{session.techniques.length}</p>
            <p className="text-sm text-gray-600">Techniques</p>
          </div>
        </div>

        {/* Session Details */}
        {(session.climbs.length > 0 || session.techniques.length > 0) && (
          <div className="space-y-3">
            {session.climbs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Climbs</h4>
                <div className="flex flex-wrap gap-2">
                  {session.climbs.map((climb, index) => (
                    <Badge key={index} variant="secondary">
                      {climb.routeGrade} {climb.climbingStyle}
                      {!climb.completed && ' (attempt)'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {session.techniques.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Techniques Practiced</h4>
                <div className="flex flex-wrap gap-2">
                  {session.techniques.map((technique, index) => (
                    <Badge key={index} variant="outline">{technique}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Flags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {session.warmUpDone && (
            <Badge variant="default" className="text-xs">Warmed Up</Badge>
          )}
          {session.newTechniquesTried && (
            <Badge variant="default" className="text-xs">New Techniques</Badge>
          )}
          {session.feltTiredAtEnd && (
            <Badge variant="secondary" className="text-xs">Felt Tired</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
