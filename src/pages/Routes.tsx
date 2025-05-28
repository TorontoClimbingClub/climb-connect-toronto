
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Mountain, ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { cn } from "@/lib/utils";

export default function Routes() {
  const navigate = useNavigate();
  const [selectedCrag, setSelectedCrag] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

  // Get unique sectors and areas
  const sectors = [...new Set(rattlesnakeRoutes.map(route => route.sector))];
  const areas = selectedSector 
    ? [...new Set(rattlesnakeRoutes.filter(route => route.sector === selectedSector).map(route => route.area))]
    : [];

  // Group routes by area within selected sector
  const routesByArea = selectedSector ? rattlesnakeRoutes
    .filter(route => route.sector === selectedSector)
    .reduce((acc, route) => {
      if (!acc[route.area]) {
        acc[route.area] = [];
      }
      acc[route.area].push(route);
      return acc;
    }, {} as Record<string, typeof rattlesnakeRoutes>) : {};

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

  const handleBack = () => {
    if (selectedSector) {
      setSelectedSector(null);
      setSelectedCrag(null);
      setExpandedAreas(new Set());
    } else if (selectedCrag) {
      setSelectedCrag(null);
    } else {
      navigate('/');
    }
  };

  const getPageTitle = () => {
    if (selectedSector) {
      return `${selectedCrag} - ${selectedSector}`;
    }
    if (selectedCrag) {
      return selectedCrag;
    }
    return 'Beta Boards';
  };

  const getPageSubtitle = () => {
    if (selectedSector) {
      return 'Select an area to view routes';
    }
    if (selectedCrag) {
      return 'Select a sector';
    }
    return 'Select a climbing area';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#E55A2B]">{getPageTitle()}</h1>
            <p className="text-stone-600">{getPageSubtitle()}</p>
          </div>
        </div>

        <div className="space-y-4">
          {!selectedCrag && (
            // Crag Selection
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCrag('Rattlesnake Point')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-[#E55A2B]" />
                  <div>
                    <CardTitle className="text-lg">Rattlesnake Point</CardTitle>
                    <p className="text-stone-600 text-sm">Milton, Ontario</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-400 ml-auto" />
                </div>
              </CardHeader>
            </Card>
          )}

          {selectedCrag && !selectedSector && (
            // Sector Selection
            sectors.map((sector) => (
              <Card key={sector} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSector(sector)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mountain className="h-6 w-6 text-[#E55A2B]" />
                    <div>
                      <CardTitle className="text-lg">{sector}</CardTitle>
                      <p className="text-stone-600 text-sm">
                        {rattlesnakeRoutes.filter(route => route.sector === sector).length} routes
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-stone-400 ml-auto" />
                  </div>
                </CardHeader>
              </Card>
            ))
          )}

          {selectedSector && (
            // Area and Routes Selection
            Object.entries(routesByArea).map(([area, routes]) => (
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
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
