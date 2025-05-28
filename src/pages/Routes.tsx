
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Mountain, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { cn } from "@/lib/utils";

export default function Routes() {
  const navigate = useNavigate();
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

  // Group routes by area
  const routesByArea = rattlesnakeRoutes.reduce((acc, route) => {
    if (!acc[route.area]) {
      acc[route.area] = [];
    }
    acc[route.area].push(route);
    return acc;
  }, {} as Record<string, typeof rattlesnakeRoutes>);

  const toggleArea = (area: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(area)) {
      newExpanded.delete(area);
    } else {
      newExpanded.add(area);
    }
    setExpandedAreas(newExpanded);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#E55A2B]">Rattlesnake Point</h1>
            <p className="text-stone-600">Climbing Routes</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(routesByArea).map(([area, routes]) => (
            <Card key={area}>
              <CardHeader className="pb-3">
                <button
                  onClick={() => toggleArea(area)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-[#E55A2B]" />
                    <CardTitle className="text-lg text-[#E55A2B]">{area}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {routes.length} routes
                    </Badge>
                  </div>
                  {expandedAreas.has(area) ? (
                    <ChevronDown className="h-5 w-5 text-stone-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-stone-400" />
                  )}
                </button>
              </CardHeader>
              
              {expandedAreas.has(area) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {routes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => navigate(`/routes/${route.id}`)}
                        className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left border border-stone-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-stone-800">{route.name}</h3>
                          <span className={cn("font-bold", getDifficultyColor(route.grade))}>
                            {route.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStyleColor(route.style)} variant="secondary">
                            {route.style}
                          </Badge>
                          <span className="text-sm text-stone-500">{route.sector}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
