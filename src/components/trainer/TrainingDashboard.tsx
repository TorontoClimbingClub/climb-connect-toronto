
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity, TrendingUp, Clock, Target, Award, Zap } from 'lucide-react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';

const TrainingDashboard = () => {
  const { allSessions, getSessionStats } = useOfflineTrainer();
  const stats = getSessionStats();

  // Generate chart data from sessions
  const sessionProgressData = allSessions.slice(0, 10).reverse().map((session, index) => ({
    session: `S${index + 1}`,
    climbs: session.climbs.length,
    date: new Date(session.sessionDate).toLocaleDateString(),
    duration: session.startTime && session.endTime 
      ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
      : 0
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
    .sort((a, b) => {
      const aNum = parseFloat(a.grade.replace('5.', ''));
      const bNum = parseFloat(b.grade.replace('5.', ''));
      return aNum - bNum;
    });

  // Technique distribution
  const techniqueDistribution = allSessions.reduce((acc, session) => {
    session.techniques.forEach(technique => {
      acc[technique] = (acc[technique] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const techniqueChartData = Object.entries(techniqueDistribution)
    .map(([technique, count]) => ({ technique, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Style distribution
  const styleDistribution = allSessions.reduce((acc, session) => {
    session.climbs.forEach(climb => {
      acc[climb.climbingStyle] = (acc[climb.climbingStyle] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const styleChartData = Object.entries(styleDistribution)
    .map(([style, count]) => ({ name: style, value: count }));

  // Feeling trends
  const feelingTrends = allSessions.slice(0, 15).reverse().map((session, index) => ({
    session: index + 1,
    feeling: session.feltAfterSession,
    feelingScore: (() => {
      switch(session.feltAfterSession) {
        case 'Great': return 5;
        case 'Good': return 4;
        case 'Okay': return 3;
        case 'Tired': return 2;
        case 'Exhausted': return 1;
        default: return 3;
      }
    })()
  }));

  const COLORS = ['#E55A2B', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sessions</p>
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
                <p className="text-sm font-medium text-gray-600">Avg/Session</p>
                <p className="text-2xl font-bold">{stats.averageClimbsPerSession}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{stats.avgDurationMinutes}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-[#E55A2B]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grades</p>
                <p className="text-2xl font-bold">{stats.uniqueGrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Progress and Duration */}
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
      </div>

      {/* Grade and Style Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gradeChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="grade" type="category" width={60} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {styleChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Climbing Style Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={styleChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {styleChartData.map((entry, index) => (
                      <Cell key={`style-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Techniques and Feeling Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {techniqueChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Most Practiced Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={techniqueChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="technique" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {feelingTrends.length > 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Recovery Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feelingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[1, 5]} tickFormatter={(value) => {
                    const feelings = ['', 'Exhausted', 'Tired', 'Okay', 'Good', 'Great'];
                    return feelings[value];
                  }} />
                  <Tooltip formatter={(value, name) => {
                    const feelings = ['', 'Exhausted', 'Tired', 'Okay', 'Good', 'Great'];
                    return [feelings[value as number], 'Feeling'];
                  }} />
                  <Line 
                    type="monotone" 
                    dataKey="feelingScore" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainingDashboard;
