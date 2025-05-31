
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ProgressTrends = () => {
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['training-trends'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('training_sessions')
        .select(`
          session_date,
          felt_after_session,
          felt_tired_at_end,
          warm_up_done,
          new_techniques_tried,
          gear_used,
          session_climbs(climbing_style)
        `)
        .order('session_date', { ascending: true });

      if (error) throw error;

      // Process feeling trends
      const feelingTrends = sessions?.map((session, index) => ({
        session: index + 1,
        date: new Date(session.session_date).toLocaleDateString(),
        feeling: session.felt_after_session,
        feelingScore: (() => {
          switch(session.felt_after_session) {
            case 'Great': return 5;
            case 'Good': return 4;
            case 'Okay': return 3;
            case 'Tired': return 2;
            case 'Exhausted': return 1;
            default: return 3;
          }
        })(),
        tiredAtEnd: session.felt_tired_at_end ? 1 : 0,
        warmedUp: session.warm_up_done ? 1 : 0,
        triedNewTechniques: session.new_techniques_tried ? 1 : 0
      })) || [];

      // Process style distribution
      const styleCount: Record<string, number> = {};
      sessions?.forEach(session => {
        session.session_climbs?.forEach(climb => {
          styleCount[climb.climbing_style] = (styleCount[climb.climbing_style] || 0) + 1;
        });
      });

      const styleDistribution = Object.entries(styleCount).map(([style, count]) => ({
        name: style,
        value: count
      }));

      // Process feeling distribution
      const feelingCount: Record<string, number> = {};
      sessions?.forEach(session => {
        if (session.felt_after_session) {
          feelingCount[session.felt_after_session] = (feelingCount[session.felt_after_session] || 0) + 1;
        }
      });

      const feelingDistribution = Object.entries(feelingCount).map(([feeling, count]) => ({
        name: feeling,
        value: count
      }));

      return {
        feelingTrends,
        styleDistribution,
        feelingDistribution
      };
    }
  });

  const COLORS = ['#E55A2B', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading trends...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Feeling Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>How You Feel After Sessions</CardTitle>
          <CardDescription>Track your energy levels and recovery over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData?.feelingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
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
                stroke="#E55A2B" 
                strokeWidth={3}
                dot={{ fill: '#E55A2B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Style Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Climbing Style Distribution</CardTitle>
          <CardDescription>Breakdown of climbing styles attempted</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendsData?.styleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trendsData?.styleDistribution?.map((entry, index) => (
                  <Cell key={`style-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feeling Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Recovery Pattern</CardTitle>
          <CardDescription>How often you feel each way after sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendsData?.feelingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trendsData?.feelingDistribution?.map((entry, index) => (
                  <Cell key={`feeling-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTrends;
