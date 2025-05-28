
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, ChevronDown, ChevronRight } from "lucide-react";
import { RouteCard } from "./RouteCard";
import { ClimbingRoute } from "@/types/routes";

interface AreaCardProps {
  area: string;
  routes: ClimbingRoute[];
  isExpanded: boolean;
  onToggle: () => void;
  onRouteClick: (routeId: string) => void;
}

export const AreaCard = ({ area, routes, isExpanded, onToggle, onRouteClick }: AreaCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-[#E55A2B]" />
            <CardTitle className="text-lg text-[#E55A2B]">{area}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {routes.length} routes
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-stone-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-stone-400" />
          )}
        </button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onClick={() => onRouteClick(route.id)}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
