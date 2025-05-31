
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeelingTrendChartProps {
  feelingTrends: Array<{
    session: number;
    feeling: string;
    feelingScore: number;
  }>;
}

const FeelingTrendChart = ({ feelingTrends }: FeelingTrendChartProps) => {
  if (feelingTrends.length <= 3) return null;

  return (
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
  );
};

export default FeelingTrendChart;
