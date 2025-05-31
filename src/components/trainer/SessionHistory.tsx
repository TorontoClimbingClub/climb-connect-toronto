
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Mountain, Target, Search, Filter } from 'lucide-react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';

const SessionHistory = () => {
  const { allSessions } = useOfflineTrainer();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and sort sessions
  const filteredSessions = allSessions
    .filter(session => {
      const matchesSearch = session.sessionGoal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.customGoal?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGoal = filterGoal === 'all' || session.sessionGoal === filterGoal;
      return matchesSearch && matchesGoal;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
        case 'date-desc':
          return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
        case 'climbs-desc':
          return b.climbs.length - a.climbs.length;
        case 'climbs-asc':
          return a.climbs.length - b.climbs.length;
        default:
          return 0;
      }
    });

  // Get unique session goals for filter
  const uniqueGoals = [...new Set(allSessions.map(s => s.sessionGoal).filter(Boolean))];

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

  if (allSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mountain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sessions Yet</h3>
            <p className="text-gray-500">
              Complete your first training session to see it appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Filter by Goal</label>
              <Select value={filterGoal} onValueChange={setFilterGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  {uniqueGoals.map(goal => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="climbs-desc">Most Climbs</SelectItem>
                  <SelectItem value="climbs-asc">Fewest Climbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
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
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatSessionDuration(session)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold">{session.gear.length}</p>
                  <p className="text-sm text-gray-600">Gear Items</p>
                </div>
              </div>

              {/* Session Details */}
              {(session.climbs.length > 0 || session.techniques.length > 0 || session.gear.length > 0) && (
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

                  {session.gear.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Gear Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {session.gear.map((gear, index) => (
                          <Badge key={index} variant="outline">{gear}</Badge>
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
                {session.gearUsed && (
                  <Badge variant="default" className="text-xs">Used Gear</Badge>
                )}
                {session.feltTiredAtEnd && (
                  <Badge variant="secondary" className="text-xs">Felt Tired</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sessions Found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
