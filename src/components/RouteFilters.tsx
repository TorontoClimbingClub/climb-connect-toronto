
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { FilterSelect } from "./filters/FilterSelect";
import { FilterActions } from "./filters/FilterActions";
import { sortGrades } from "./filters/GradeSorter";

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
            <FilterSelect
              value={selectedGrade}
              onValueChange={setSelectedGrade}
              placeholder="Any grade"
              label="Grade"
              options={grades}
            />

            <FilterSelect
              value={selectedStyle}
              onValueChange={setSelectedStyle}
              placeholder="Any style"
              label="Style"
              options={styles}
            />

            <FilterSelect
              value={selectedArea}
              onValueChange={setSelectedArea}
              placeholder="Any area"
              label="Area"
              options={areas}
            />

            <FilterSelect
              value={selectedSector}
              onValueChange={setSelectedSector}
              placeholder="Any sector"
              label="Sector"
              options={sectors}
            />
          </div>

          <FilterActions
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </CardContent>
      )}
    </Card>
  );
};
