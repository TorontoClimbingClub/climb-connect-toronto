
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, TrendingUp, Clock, Target, Award, Zap } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalSessions: number;
    totalClimbs: number;
    averageClimbsPerSession: number;
    avgDurationMinutes: number;
    completionRate: number;
    uniqueGrades: number;
  };
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
};

export default StatsOverview;
