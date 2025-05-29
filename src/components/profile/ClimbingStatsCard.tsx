
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClimbingStats } from "@/hooks/useClimbingStats";
import { TrendingUp, Mountain, Calendar } from "lucide-react";

interface ClimbingStatsCardProps {
  userId: string;
}

export function ClimbingStatsCard({ userId }: ClimbingStatsCardProps) {
  const { stats, loading } = useClimbingStats(userId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Climbing Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total_completions === 0) {
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
