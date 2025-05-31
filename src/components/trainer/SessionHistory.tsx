import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Target, Zap, Trash2 } from 'lucide-react';
import { useTrainingSessions } from '@/hooks/trainer/useTrainingSessions';
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SessionHistory = () => {
  const { sessions, isLoading, deleteSession, isDeleting } = useTrainingSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredSessions = sessions?.filter(session => {
    const matchesSearch = !searchTerm || 
      session.session_goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.custom_goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.max_grade_climbed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || session.session_date === selectedDate;
    
    return matchesSearch && matchesDate;
  }) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading session history...</div>
        </CardContent>
      </Card>
    );
  }

  const formatSessionDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getFeelingColor = (feeling: string | null) => {
    switch (feeling) {
      case 'Great': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Okay': return 'bg-yellow-100 text-yellow-800';
      case 'Tired': return 'bg-orange-100 text-orange-800';
      case 'Exhausted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by goal, grade, or notes..."
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          {(searchTerm || selectedDate) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                {sessions?.length === 0 
                  ? "No training sessions recorded yet. Start by logging your first session!"
                  : "No sessions match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      {format(parseISO(session.session_date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(parseISO(session.start_time), 'h:mm a')} - 
                        {session.end_time ? format(parseISO(session.end_time), 'h:mm a') : 'Ongoing'}
                      </span>
                      <span>
                        Duration: {formatSessionDuration(session.start_time, session.end_time)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.felt_after_session && (
                      <Badge className={getFeelingColor(session.felt_after_session)}>
                        {session.felt_after_session}
                      </Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={isDeleting}
                        >
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
                            onClick={() => handleDeleteSession(session.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Goal:</strong> {session.session_goal || session.custom_goal || 'None specified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Climbs:</strong> {session.total_climbs}
                      {session.max_grade_climbed && ` • Max: ${session.max_grade_climbed}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {session.warm_up_done && (
                    <Badge variant="outline">Warmed Up</Badge>
                  )}
                  {session.new_techniques_tried && (
                    <Badge variant="outline">New Techniques</Badge>
                  )}
                  {session.gear_used && (
                    <Badge variant="outline">Used Gear</Badge>
                  )}
                  {session.felt_tired_at_end && (
                    <Badge variant="outline">Tired at End</Badge>
                  )}
                </div>

                {session.would_change_next_time && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Reflection:</strong> {session.would_change_next_time}
                    </p>
                  </div>
                )}

                {/* Show climb details if available */}
                {session.session_climbs && session.session_climbs.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Climbs:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {session.session_climbs.map((climb, index) => (
                        <div key={climb.id} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="font-medium">
                            {climb.route_grade} • {climb.climbing_style}
                          </div>
                          <div className="text-gray-600">
                            {climb.attempts_made} attempt{climb.attempts_made !== 1 ? 's' : ''}
                            {climb.falls_count > 0 && ` • ${climb.falls_count} falls`}
                            {climb.is_hardest_climb && ' • Hardest'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
