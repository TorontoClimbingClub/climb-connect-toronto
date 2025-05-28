
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { FilterSelect } from "./filters/FilterSelect";
import { sortGrades } from "./filters/GradeSorter";
import { Badge } from "@/components/ui/badge";

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

  // Get unique values for filter options with proper sorting
  const grades = sortGrades([...new Set(routes.map(route => route.grade))]);
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

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case 'grade':
        setSelectedGrade("");
        break;
      case 'style':
        setSelectedStyle("");
        break;
      case 'area':
        setSelectedArea("");
        break;
      case 'sector':
        setSelectedSector("");
        break;
    }
    // Apply filters immediately after clearing individual filter
    setTimeout(() => {
      let filtered = routes;
      const currentGrade = filterType === 'grade' ? "" : selectedGrade;
      const currentStyle = filterType === 'style' ? "" : selectedStyle;
      const currentArea = filterType === 'area' ? "" : selectedArea;
      const currentSector = filterType === 'sector' ? "" : selectedSector;

      if (currentGrade) filtered = filtered.filter(route => route.grade === currentGrade);
      if (currentStyle) filtered = filtered.filter(route => route.style === currentStyle);
      if (currentArea) filtered = filtered.filter(route => route.area === currentArea);
      if (currentSector) filtered = filtered.filter(route => route.sector === currentSector);

      onFiltersChange(filtered);
    }, 0);
  };

  // Apply filters automatically when any filter changes
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    setTimeout(() => applyFilters(), 0);
  };

  const hasActiveFilters = Boolean(selectedGrade || selectedStyle || selectedArea || selectedSector);
  const activeFilters = [
    selectedGrade && { type: 'grade', label: 'Grade', value: selectedGrade },
    selectedStyle && { type: 'style', label: 'Style', value: selectedStyle },
    selectedArea && { type: 'area', label: 'Area', value: selectedArea },
    selectedSector && { type: 'sector', label: 'Sector', value: selectedSector },
  ].filter(Boolean);

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
                {activeFilters.length}
              </span>
            )}
          </CardTitle>
        </button>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3">
            <div className="text-sm text-stone-600 mb-2">Active filters:</div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge 
                  key={filter.type} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-[#E55A2B] text-white hover:bg-orange-700"
                >
                  <span className="text-xs">{filter.label}: {filter.value}</span>
                  <button
                    onClick={() => clearIndividualFilter(filter.type)}
                    className="ml-1 hover:bg-orange-800 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect
              value={selectedGrade}
              onValueChange={handleGradeChange}
              placeholder="Any grade"
              label="Grade"
              options={grades}
            />

            <FilterSelect
              value={selectedStyle}
              onValueChange={handleStyleChange}
              placeholder="Any style"
              label="Style"
              options={styles}
            />

            <FilterSelect
              value={selectedArea}
              onValueChange={handleAreaChange}
              placeholder="Any area"
              label="Area"
              options={areas}
            />

            <FilterSelect
              value={selectedSector}
              onValueChange={handleSectorChange}
              placeholder="Any sector"
              label="Sector"
              options={sectors}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex justify-center pt-2">
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 text-sm"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
