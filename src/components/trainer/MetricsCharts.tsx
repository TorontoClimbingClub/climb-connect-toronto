
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MetricsCharts = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['training-chart-data'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('training_sessions')
        .select(`
          session_date,
          total_climbs,
          max_grade_climbed,
          felt_after_session,
          session_climbs(attempts_made, rest_time_minutes, completed)
        `)
        .order('session_date', { ascending: true });

      if (error) throw error;

      // Process data for charts
      const processed = sessions?.map((session, index) => {
        const totalAttempts = session.session_climbs?.reduce((sum, climb) => sum + climb.attempts_made, 0) || 0;
        const avgAttempts = session.total_climbs > 0 ? totalAttempts / session.total_climbs : 0;
        
        const totalRestTime = session.session_climbs?.reduce((sum, climb) => sum + (climb.rest_time_minutes || 0), 0) || 0;
        const avgRestTime = session.session_climbs?.length > 0 ? totalRestTime / session.session_climbs.length : 0;

        const completedClimbs = session.session_climbs?.filter(climb => climb.completed).length || 0;
        const completionRate = session.session_climbs?.length > 0 ? (completedClimbs / session.session_climbs.length) * 100 : 0;

        return {
          date: new Date(session.session_date).toLocaleDateString(),
          session: index + 1,
          totalClimbs: session.total_climbs,
          avgAttempts: parseFloat(avgAttempts.toFixed(1)),
          avgRestTime: parseFloat(avgRestTime.toFixed(1)),
          feeling: session.felt_after_session,
          completionRate: parseFloat(completionRate.toFixed(1))
        };
      }) || [];

      return processed;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading chart...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Climbs per Session */}
      <Card>
        <CardHeader>
          <CardTitle>Climbs per Session</CardTitle>
          <CardDescription>Track your climbing volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="totalClimbs" 
                stroke="#E55A2B" 
                strokeWidth={2}
                dot={{ fill: '#E55A2B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Attempts per Climb */}
      <Card>
        <CardHeader>
          <CardTitle>Attempts per Climb</CardTitle>
          <CardDescription>Efficiency metric - lower is better</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgAttempts" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Rest Time */}
      <Card>
        <CardHeader>
          <CardTitle>Average Rest Time</CardTitle>
          <CardDescription>Rest between climbs (minutes)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgRestTime" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Percentage of climbs completed successfully</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Line 
                type="monotone" 
                dataKey="completionRate" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCharts;
