
import React from 'react';
import { useSimplifiedTrainer } from '@/hooks/trainer/useSimplifiedTrainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell } from 'recharts';
import { TrendingUp, Target, Activity, Clock, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import EmptyState from './charts/EmptyState';

const SimplifiedDashboard = () => {
  const { allSessions, getSessionStats, getRecoveryRecommendation } = useSimplifiedTrainer();
  const stats = getSessionStats();

  if (allSessions.length === 0) {
    return <EmptyState />;
  }

  // Filter sessions with SII data
  const sessionsWithSII = allSessions.filter(s => s.sii !== undefined);

  if (sessionsWithSII.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              No SII Data Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Complete a session with workout metrics to see Session Intensity Index analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare SII timeline data
  const siiTimelineData = sessionsWithSII.slice(0, 15).reverse().map((session, index) => {
    const sessionDate = new Date(session.startTime);
    return {
      session: `S${index + 1}`,
      sii: parseFloat((session.sii || 0).toFixed(2)),
      date: sessionDate.toLocaleDateString(),
      intensity: session.sii! < 0.8 ? 'Low' : session.sii! < 1.2 ? 'Moderate' : 'High'
    };
  });

  // SII distribution
  const siiDistribution = [
    { range: 'Low (< 0.8)', count: sessionsWithSII.filter(s => s.sii! < 0.8).length, color: '#3B82F6' },
    { range: 'Moderate (0.8-1.2)', count: sessionsWithSII.filter(s => s.sii! >= 0.8 && s.sii! < 1.2).length, color: '#10B981' },
    { range: 'High (> 1.2)', count: sessionsWithSII.filter(s => s.sii! >= 1.2).length, color: '#F59E0B' }
  ];

  // Recovery correlation data (mock for now)
  const recoveryData = sessionsWithSII.map((session, index) => {
    const prevSession = sessionsWithSII[index + 1];
    if (!prevSession) return null;
    
    const daysBetween = Math.floor(
      (new Date(session.startTime).getTime() - new Date(prevSession.startTime).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      restDays: daysBetween,
      previousSII: parseFloat((prevSession.sii || 0).toFixed(2)),
      currentPerformance: session.recoveryFeeling || 3,
      sii: parseFloat((session.sii || 0).toFixed(2))
    };
  }).filter(Boolean);

  // Get latest SII for recommendation
  const latestSession = sessionsWithSII[0];
  const recommendation = getRecoveryRecommendation(latestSession?.sii);

  const getSIIColor = (sii: number) => {
    if (sii < 0.8) return '#3B82F6';
    if (sii < 1.2) return '#10B981';
    return '#F59E0B';
  };

  const getSIIBadgeVariant = (sii: number) => {
    if (sii < 1.2) return 'secondary';
    return 'destructive';
  };

  const getSIIBadgeText = (sii: number) => {
    if (sii < 1.2) return 'Moderate';
    return 'High';
  };

  const SIIFormulaTooltip = () => (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2 text-sm">
            <p><strong>Session Intensity Index (SII) Formula:</strong></p>
            <p>SII = Physical Load × Performance Load × Duration Factor</p>
            <div className="space-y-1 text-xs">
              <p><strong>Physical Load:</strong> (Hang + Pullups + Lockoff ratios) / 3</p>
              <p><strong>Performance Load:</strong> Grade Factor × Efficiency Factor</p>
              <p><strong>Duration Factor:</strong> 0.7 + (Session hours × 0.15)</p>
            </div>
            <p className="text-xs text-gray-500">Based on 30-day rolling averages</p>
          </div>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions with SII</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsWithSII.length}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalSessions} total sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Average SII
              <SIIFormulaTooltip />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSII?.toFixed(2) || '0.00'}</div>
            {stats.averageSII && stats.averageSII >= 1.2 && (
              <Badge variant={getSIIBadgeVariant(stats.averageSII)} className="mt-1">
                {getSIIBadgeText(stats.averageSII)} Intensity
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest SII</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestSession?.sii?.toFixed(2) || '0.00'}</div>
            {latestSession?.sii && latestSession.sii >= 1.2 && (
              <Badge variant={getSIIBadgeVariant(latestSession.sii)} className="mt-1">
                {getSIIBadgeText(latestSession.sii)}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rec.</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendation.recommendedRestDays} days</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {recommendation.confidenceLevel}
              </Badge>
              {recommendation.confidenceLevel === 'low' && (
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Recommendation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recovery Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Recommended rest: {recommendation.recommendedRestDays} days
            </p>
            <p className="text-gray-600">{recommendation.reason}</p>
            <Badge variant="outline">
              Confidence: {recommendation.confidenceLevel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SII Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Session Intensity Timeline
              <SIIFormulaTooltip />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={siiTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 2.0]} />
                <Tooltip 
                  labelFormatter={(label) => {
                    const sessionIndex = parseInt(label.replace('S', '')) - 1;
                    return siiTimelineData[sessionIndex]?.date || label;
                  }}
                  formatter={(value, name) => [value, 'SII']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sii" 
                  stroke="#E55A2B" 
                  strokeWidth={2}
                  dot={(props: any) => (
                    <circle 
                      cx={props.cx} 
                      cy={props.cy} 
                      r={4} 
                      fill={getSIIColor(props.payload.sii)}
                    />
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SII Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Intensity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={siiDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {siiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recovery Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Rest vs Performance Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={recoveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="restDays" name="Rest Days" />
                <YAxis dataKey="currentPerformance" name="Performance" domain={[1, 5]} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'currentPerformance' ? `${value}/5` : value,
                    name === 'currentPerformance' ? 'Recovery Feeling' : name
                  ]}
                />
                <Scatter dataKey="currentPerformance" fill="#8B5CF6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SII Intensity Heat Map placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Intensity Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {siiDistribution.map((item) => (
                  <div key={item.range} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-600">{item.range}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Distribution of session intensities over time
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
