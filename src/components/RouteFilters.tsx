
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";

interface RouteFiltersProps {
  routes: ClimbingRoute[];
  onFiltersChange: (filteredRoutes: ClimbingRoute[]) => void;
}

export const RouteFilters = ({ routes, onFiltersChange }: RouteFiltersProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filter options
  const grades = [...new Set(routes.map(route => route.grade))].sort();
  const styles = [...new Set(routes.map(route => route.style))];
  const areas = [...new Set(routes.map(route => route.area))].sort();
  const sectors = [...new Set(routes.map(route => route.sector))].sort();

  const applyFilters = () => {
    let filtered = routes;

    if (selectedGrade) {
      filtered = filtered.filter(route => route.grade === selectedGrade);
    }
    if (selectedStyle) {
      filtered = filtered.filter(route => route.style === selectedStyle);
    }
    if (selectedArea) {
      filtered = filtered.filter(route => route.area === selectedArea);
    }
    if (selectedSector) {
      filtered = filtered.filter(route => route.sector === selectedSector);
    }

    onFiltersChange(filtered);
  };

  const clearFilters = () => {
    setSelectedGrade("");
    setSelectedStyle("");
    setSelectedArea("");
    setSelectedSector("");
    onFiltersChange(routes);
  };

  const hasActiveFilters = selectedGrade || selectedStyle || selectedArea || selectedSector;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#E55A2B]" />
            Filter Routes
            {hasActiveFilters && (
              <span className="bg-[#E55A2B] text-white text-xs px-2 py-1 rounded-full">
                {[selectedGrade, selectedStyle, selectedArea, selectedSector].filter(Boolean).length}
              </span>
            )}
          </CardTitle>
        </button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1 block">Grade</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Any grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-1 block">Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Any style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-1 block">Area</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Any area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-1 block">Sector</label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Any sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={applyFilters}
              className="flex-1 bg-[#E55A2B] hover:bg-orange-700"
            >
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button 
                onClick={clearFilters}
                variant="outline"
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
