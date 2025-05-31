
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SessionProgressChartsProps {
  sessionProgressData: Array<{
    session: string;
    climbs: number;
    date: string;
    duration: number;
  }>;
}

const SessionProgressCharts = ({ sessionProgressData }: SessionProgressChartsProps) => {
  return (
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
  );
};

export default SessionProgressCharts;
