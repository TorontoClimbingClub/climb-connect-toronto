
import React from 'react';
import { useOfflineTrainer } from '@/hooks/trainer/useOfflineTrainer';
import StatsOverview from './charts/StatsOverview';
import SessionProgressCharts from './charts/SessionProgressCharts';
import DistributionCharts from './charts/DistributionCharts';
import FeelingTrendChart from './charts/FeelingTrendChart';
import EmptyState from './charts/EmptyState';

const TrainingDashboard = () => {
  const { allSessions, getSessionStats } = useOfflineTrainer();
  const stats = getSessionStats();

  if (allSessions.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState />
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <StatsOverview stats={stats} />
      <SessionProgressCharts sessionProgressData={sessionProgressData} />
      <DistributionCharts 
        gradeChartData={gradeChartData}
        styleChartData={styleChartData}
        techniqueChartData={techniqueChartData}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeelingTrendChart feelingTrends={feelingTrends} />
      </div>
    </div>
  );
};

export default TrainingDashboard;
