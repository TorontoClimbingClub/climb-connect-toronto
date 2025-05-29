
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, MapPin, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStyleColor, getDifficultyColor } from "@/utils/climbing-styles";
import { ClimbingRoute } from "@/types/routes";

interface RouteDetailsCardProps {
  route: ClimbingRoute;
  completed: boolean;
  canToggleCompletion: boolean;
  onToggleCompletion: () => void;
}

export function RouteDetailsCard({ 
  route, 
  completed, 
  canToggleCompletion, 
  onToggleCompletion 
}: RouteDetailsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{route.name}</CardTitle>
          {canToggleCompletion && (
            <Button
              onClick={onToggleCompletion}
              variant={completed ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2",
                completed 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-green-600 text-green-600 hover:bg-green-50"
              )}
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  Mark Complete
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm font-medium text-stone-700">Grade</span>
            <p className={cn("text-lg font-bold", getDifficultyColor(route.grade))}>
              {route.grade}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-stone-700">Style</span>
            <div className="mt-1">
              <Badge className={getStyleColor(route.style)} variant="secondary">
                {route.style}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-stone-500" />
            <span className="text-sm"><strong>Sector:</strong> {route.sector}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-stone-500" />
            <span className="text-sm"><strong>Area:</strong> {route.area}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
