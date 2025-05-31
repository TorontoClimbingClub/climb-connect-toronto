
import React, { useState } from 'react';
import { useSimplifiedTrainer } from '@/hooks/trainer/useSimplifiedTrainer';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Clock, Mountain } from 'lucide-react';
import { format } from 'date-fns';
import EmptyHistoryState from './history/EmptyHistoryState';

const SimplifiedSessionHistory = () => {
  const { allSessions, deleteSession } = useSimplifiedTrainer();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and sort sessions
  const filteredSessions = allSessions
    .filter(session => {
      return session.climbs.some(climb => 
        climb.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'date-desc':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'climbs-desc':
          return b.climbs.length - a.climbs.length;
        case 'climbs-asc':
          return a.climbs.length - b.climbs.length;
        default:
          return 0;
      }
    });

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast({
        title: "Session Deleted",
        description: "Training session has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete training session.",
        variant: "destructive",
      });
    }
  };

  const getSessionDuration = (session: any) => {
    if (!session.startTime || !session.endTime) return 'N/A';
    const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
    return `${Math.floor(duration / (1000 * 60))} min`;
  };

  if (allSessions.length === 0) {
    return <EmptyHistoryState type="no-sessions" />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="climbs-desc">Most climbs</SelectItem>
                <SelectItem value="climbs-asc">Least climbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Session List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mountain className="h-5 w-5" />
                  {format(new Date(session.startTime), 'PPP')}
                </div>
                <Button
                  onClick={() => handleDeleteSession(session.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration: {getSessionDuration(session)}
                </div>
                <div>Climbs: {session.climbs.length}</div>
              </div>
            </CardHeader>
            <CardContent>
              {session.climbs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {session.climbs.map((climb) => (
                    <div key={climb.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{climb.grade}</Badge>
                        <span className="text-sm text-gray-600">{climb.durationMinutes}min</span>
                        <span className="text-sm text-gray-600">{climb.numberOfTakes} takes</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No climbs logged in this session</p>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredSessions.length === 0 && (
          <EmptyHistoryState type="no-results" />
        )}
      </div>
    </div>
  );
};

export default SimplifiedSessionHistory;
