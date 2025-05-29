
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mountain, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { ClimbCompletion, useClimbCompletions } from "@/hooks/useClimbCompletions";

interface CompletedRoutesListProps {
  completions: ClimbCompletion[];
}

export function CompletedRoutesList({ completions }: CompletedRoutesListProps) {
  const navigate = useNavigate();
  const { toggleCompletion } = useClimbCompletions();

  const completedRoutes = completions.map(completion => {
    const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
    return route ? { ...route, completedAt: completion.completed_at } : null;
  }).filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0;
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-orange-100 text-orange-800';
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Top Rope':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (grade: string) => {
    if (grade.includes('5.1') && (grade.includes('0') || grade.includes('1') || grade.includes('2'))) {
      return 'text-red-600 font-bold';
    }
    if (grade.includes('5.9') || grade.includes('5.10')) {
      return 'text-orange-600 font-semibold';
    }
    if (grade.includes('5.7') || grade.includes('5.8')) {
      return 'text-yellow-600 font-medium';
    }
    return 'text-green-600';
  };

  const handleRouteClick = (routeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/routes/${routeId}`);
  };

  const handleToggleCompletion = (routeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleCompletion(routeId);
  };

  if (completedRoutes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Completed Routes (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-stone-500">
            <Mountain className="h-12 w-12 mx-auto mb-4 text-stone-400" />
            <p>No routes completed yet. Start climbing to see your progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Completed Routes ({completedRoutes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {completedRoutes.map((route) => {
            if (!route) return null;
            return (
              <div
                key={route.id}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={(e) => handleRouteClick(route.id, e)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-stone-900">{route.name}</h4>
                    <Badge className={getStyleColor(route.style)} variant="secondary">
                      {route.style}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-600">
                    <span className={getDifficultyColor(route.grade)}>
                      {route.grade}
                    </span>
                    <span>{route.area}</span>
                    <span className="text-xs">
                      Completed {new Date(route.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleRouteClick(route.id, e)}
                    className="text-stone-500 hover:text-stone-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleToggleCompletion(route.id, e)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Mark as not completed"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
