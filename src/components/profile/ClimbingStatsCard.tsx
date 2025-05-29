
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mountain, Calendar } from "lucide-react";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";

interface ClimbingStatsCardProps {
  userId: string;
  completions: ClimbCompletion[];
}

export function ClimbingStatsCard({ userId, completions }: ClimbingStatsCardProps) {
  // Filter completions for this user
  const userCompletions = completions.filter(c => c.user_id === userId);

  if (userCompletions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Climbing Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No completed climbs yet. Start logging your sends!</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats from the completions data
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalCompletions = userCompletions.length;
  
  // Get route data for each completion
  const completedRoutes = userCompletions.map(completion => {
    const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
    return route ? { ...route, completedAt: completion.completed_at } : null;
  }).filter(Boolean);

  // Count completions by style
  const tradCompletions = completedRoutes.filter(route => route?.style === 'Trad').length;
  const sportCompletions = completedRoutes.filter(route => route?.style === 'Sport').length;
  const topRopeCompletions = completedRoutes.filter(route => route?.style === 'Top Rope').length;

  const recentCompletions = userCompletions.filter(c => 
    new Date(c.completed_at) >= thirtyDaysAgo
  ).length;

  // Find hardest grade (simplified - just get the highest grade string)
  const grades = completedRoutes
    .map(route => route?.grade)
    .filter(grade => grade !== undefined)
    .sort();
  const hardestGrade = grades.length > 0 ? grades[grades.length - 1] : null;

  const stats = {
    total_completions: totalCompletions,
    trad_completions: tradCompletions,
    sport_completions: sportCompletions,
    top_rope_completions: topRopeCompletions,
    hardest_grade: hardestGrade,
    recent_completions: recentCompletions
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Climbing Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E55A2B]">{stats.total_completions}</div>
            <div className="text-sm text-gray-600">Total Sends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E55A2B]">{stats.hardest_grade || 'N/A'}</div>
            <div className="text-sm text-gray-600">Hardest Grade</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.trad_completions > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Trad: {stats.trad_completions}
            </Badge>
          )}
          {stats.sport_completions > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Sport: {stats.sport_completions}
            </Badge>
          )}
          {stats.top_rope_completions > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Top Rope: {stats.top_rope_completions}
            </Badge>
          )}
        </div>

        {stats.recent_completions > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{stats.recent_completions} sends in the last 30 days</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
