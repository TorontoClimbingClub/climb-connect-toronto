
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";

interface CompletionProgressBarsProps {
  completions: ClimbCompletion[];
  title?: string;
  areaName?: string;
  compact?: boolean;
  hiddenStyles?: string[];
}

export function CompletionProgressBars({ 
  completions, 
  title = "Climbing Progress", 
  areaName = "Rattlesnake Point",
  compact = false,
  hiddenStyles = []
}: CompletionProgressBarsProps) {
  const progressData = useMemo(() => {
    // Group routes by style
    const routesByStyle = rattlesnakeRoutes.reduce((acc, route) => {
      if (!acc[route.style]) {
        acc[route.style] = [];
      }
      acc[route.style].push(route);
      return acc;
    }, {} as Record<string, typeof rattlesnakeRoutes>);

    // Calculate completions by style
    const styleProgress = Object.entries(routesByStyle)
      .filter(([style]) => !hiddenStyles.includes(style))
      .map(([style, routes]) => {
        const completedRoutes = completions.filter(completion => 
          routes.some(route => route.id === completion.route_id)
        ).length;

        const totalRoutes = routes.length;
        const percentage = totalRoutes > 0 ? Math.round((completedRoutes / totalRoutes) * 100) : 0;

        return {
          style,
          completed: completedRoutes,
          total: totalRoutes,
          percentage,
        };
      });

    // Calculate overall progress
    const totalCompleted = completions.length;
    const totalRoutes = rattlesnakeRoutes.length;
    const overallPercentage = totalRoutes > 0 ? Math.round((totalCompleted / totalRoutes) * 100) : 0;

    return {
      styles: styleProgress,
      overall: {
        completed: totalCompleted,
        total: totalRoutes,
        percentage: overallPercentage,
      },
    };
  }, [completions, hiddenStyles]);

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return '#E55A2B'; // Orange
      case 'Sport':
        return '#3B82F6'; // Blue
      case 'Top Rope':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-stone-700">
          {areaName}: {progressData.overall.completed}/{progressData.overall.total} ({progressData.overall.percentage}%)
        </div>
        <div className="space-y-1">
          {progressData.styles.map(({ style, percentage }) => (
            <div key={style} className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-600 w-16">{style}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getStyleColor(style)
                  }}
                />
              </div>
              <span className="text-xs text-stone-500 w-8">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-stone-600">
          {areaName}: {progressData.overall.completed} of {progressData.overall.total} routes completed ({progressData.overall.percentage}%)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-stone-600">{progressData.overall.percentage}%</span>
          </div>
          <Progress 
            value={progressData.overall.percentage} 
            className="h-3"
          />
          <p className="text-xs text-stone-500">
            {progressData.overall.completed} / {progressData.overall.total} routes
          </p>
        </div>

        {/* Progress by Style */}
        {progressData.styles.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-stone-700">Progress by Style</h4>
            {progressData.styles.map(({ style, completed, total, percentage }) => (
              <div key={style} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{style}</span>
                  <span className="text-sm text-stone-600">{percentage}%</span>
                </div>
                <div className="relative">
                  <div 
                    className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStyleColor(style)
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-stone-500">
                  {completed} / {total} routes
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
