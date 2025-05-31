
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Clock, Target } from 'lucide-react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';

const TrainingDashboard = () => {
  const { allSessions, getSessionStats } = useOfflineTrainer();
  const stats = getSessionStats();

  // Generate chart data from sessions
  const chartData = allSessions.slice(0, 10).reverse().map((session, index) => ({
    session: `S${index + 1}`,
    climbs: session.climbs.length,
    date: new Date(session.sessionDate).toLocaleDateString()
  }));

  // Grade distribution
  const gradeDistribution = allSessions.reduce((acc, session) => {
    session.climbs.forEach(climb => {
      acc[climb.routeGrade] = (acc[climb.routeGrade] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const gradeChartData = Object.entries(gradeDistribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => a.grade.localeCompare(b.grade));

  if (allSessions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Training Data Yet</h3>
              <p className="text-gray-500">
                Complete some training sessions to see your analytics and progress charts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Climbs</p>
                <p className="text-2xl font-bold">{stats.totalClimbs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Grades</p>
                <p className="text-2xl font-bold">{stats.uniqueGrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Session</p>
                <p className="text-2xl font-bold">{stats.averageClimbsPerSession}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Session Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => {
                  const sessionIndex = parseInt(label.replace('S', '')) - 1;
                  return chartData[sessionIndex]?.date || label;
                }}
              />
              <Bar dataKey="climbs" fill="#E55A2B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      {gradeChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allSessions.slice(0, 5).map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    {new Date(session.sessionDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.sessionGoal} • {session.climbs.length} climbs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {session.startTime && session.endTime && (
                      `${Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))} min`
                    )}
                  </p>
                  {session.climbs.length > 0 && (
                    <p className="text-xs text-gray-400">
                      Max: {Math.max(...session.climbs.map(c => c.routeGrade || '5.6').map(g => parseFloat(g.replace('5.', ''))))}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingDashboard;
