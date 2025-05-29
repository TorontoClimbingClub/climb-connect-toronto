
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mountain, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { ClimbCompletion, useClimbCompletions } from "@/hooks/useClimbCompletions";
import { getStyleColor, getDifficultyColor } from "@/utils/climbing-styles";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface CompletedRoutesListProps {
  completions: ClimbCompletion[];
  userId?: string; // Optional userId for viewing other users' completions
}

export function CompletedRoutesList({ completions, userId }: CompletedRoutesListProps) {
  const navigate = useNavigate();
  const { toggleCompletion } = useClimbCompletions();
  const { user } = useAuth();
  const [localCompletions, setLocalCompletions] = useState(completions);

  // Use local state for immediate UI updates
  const userCompletions = localCompletions;
  
  const completedRoutes = userCompletions.map(completion => {
    const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
    return route ? { ...route, completedAt: completion.completed_at } : null;
  }).filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0;
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  const handleRouteClick = (routeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/routes/${routeId}`);
  };

  const handleToggleCompletion = async (routeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Optimistically remove from local state for immediate UI update
    setLocalCompletions(prev => prev.filter(c => c.route_id !== routeId));
    
    // Then trigger the actual API call
    await toggleCompletion(routeId);
  };

  // Update local state when completions prop changes
  React.useEffect(() => {
    setLocalCompletions(completions);
  }, [completions]);

  const isOwnProfile = !userId || userId === user?.id;

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
            <p>{isOwnProfile ? "No routes completed yet. Start climbing to see your progress!" : "No completed routes to display."}</p>
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
                  {isOwnProfile && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleToggleCompletion(route.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Mark as not completed"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
