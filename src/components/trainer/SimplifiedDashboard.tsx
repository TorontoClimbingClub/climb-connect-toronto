
import React from 'react';
import { useSimplifiedTrainer } from '@/hooks/trainer/useSimplifiedTrainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, Mountain, TrendingUp, Target } from 'lucide-react';
import EmptyState from './charts/EmptyState';

const SimplifiedDashboard = () => {
  const { allSessions, getSessionStats } = useSimplifiedTrainer();
  const stats = getSessionStats();

  if (allSessions.length === 0) {
    return <EmptyState />;
  }

  // Generate chart data from sessions
  const sessionProgressData = allSessions.slice(0, 10).reverse().map((session, index) => {
    const duration = session.startTime && session.endTime 
      ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
      : 0;
    
    return {
      session: `S${index + 1}`,
      climbs: session.climbs.length,
      duration,
      date: new Date(session.startTime).toLocaleDateString()
    };
  });

  // Grade distribution
  const gradeDistribution = allSessions.reduce((acc, session) => {
    session.climbs.forEach(climb => {
      acc[climb.grade] = (acc[climb.grade] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const gradeChartData = Object.entries(gradeDistribution)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => {
      const aNum = parseFloat(a.grade.replace('5.', ''));
      const bNum = parseFloat(b.grade.replace('5.', ''));
      return aNum - bNum;
    });

  // Takes over time (efficiency metric)
  const takesOverTime = allSessions.slice(0, 10).reverse().map((session, index) => {
    const averageTakes = session.climbs.length > 0 
      ? session.climbs.reduce((sum, climb) => sum + climb.numberOfTakes, 0) / session.climbs.length
      : 0;
    
    return {
      session: `S${index + 1}`,
      averageTakes: parseFloat(averageTakes.toFixed(1)),
      date: new Date(session.startTime).toLocaleDateString()
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Climbs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClimbs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSessionDuration} min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Climbs/Session</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageClimbsPerSession}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    const sessionIndex = parseInt(label.replace('S', '')) - 1;
                    return sessionProgressData[sessionIndex]?.date || label;
                  }}
                />
                <Bar dataKey="climbs" fill="#E55A2B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Duration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sessionProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    const sessionIndex = parseInt(label.replace('S', '')) - 1;
                    return sessionProgressData[sessionIndex]?.date || label;
                  }}
                  formatter={(value) => [`${value} min`, 'Duration']}
                />
                <Line type="monotone" dataKey="duration" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Trend (Avg Takes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={takesOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    const sessionIndex = parseInt(label.replace('S', '')) - 1;
                    return takesOverTime[sessionIndex]?.date || label;
                  }}
                  formatter={(value) => [`${value} takes`, 'Average Takes']}
                />
                <Line type="monotone" dataKey="averageTakes" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
