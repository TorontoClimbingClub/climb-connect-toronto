
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, ChevronDown } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { Button } from "@/components/ui/button";
import { useRouteFilters } from "@/hooks/useRouteFilters";
import { FilterControls } from "./FilterControls";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";

interface EnhancedRouteFiltersProps {
  routes: ClimbingRoute[];
  onFiltersChange: (filteredRoutes: ClimbingRoute[]) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

/**
 * Enhanced route filters component with optimized state management
 */
export const EnhancedRouteFilters = ({ 
  routes, 
  onFiltersChange, 
  isExpanded: externalExpanded,
  onExpandedChange 
}: EnhancedRouteFiltersProps) => {
  const {
    filters,
    filteredRoutes,
    filterOptions,
    hasActiveFilters,
    hasAreaSectorConflict,
    updateFilters,
    clearAllFilters,
    clearIndividualFilter
  } = useRouteFilters(routes);

  const isExpanded = externalExpanded ?? false;

  // Apply filters whenever they change
  useEffect(() => {
    onFiltersChange(filteredRoutes);
  }, [filteredRoutes, onFiltersChange]);

  const handleStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked 
      ? [...filters.selectedStyles, style]
      : filters.selectedStyles.filter(s => s !== style);
    updateFilters({ selectedStyles: newStyles });
  };

  const toggleExpanded = () => {
    if (onExpandedChange) {
      onExpandedChange(!isExpanded);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <button
          onClick={toggleExpanded}
          className="flex items-center justify-between w-full text-left"
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#E55A2B]" />
            Filter Routes
            {hasActiveFilters && (
              <span className="bg-[#E55A2B] text-white text-xs px-2 py-1 rounded-full">
                {[
                  filters.selectedGrade,
                  filters.selectedStyles.length > 0,
                  filters.selectedArea,
                  filters.selectedSector
                ].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </CardTitle>
        </button>
        
        <ActiveFiltersDisplay
          selectedGrade={filters.selectedGrade}
          gradeDirection={filters.gradeDirection}
          selectedStyles={filters.selectedStyles}
          selectedArea={filters.selectedArea}
          selectedSector={filters.selectedSector}
          onClearFilter={clearIndividualFilter}
        />

        {/* Area/Sector Conflict Warning */}
        {hasAreaSectorConflict && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Warning: The selected area "{filters.selectedArea}" is not in sector "{filters.selectedSector}". 
              This combination will show no results.
            </p>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <FilterControls
            grades={filterOptions.grades}
            styles={filterOptions.styles}
            areas={filterOptions.areas}
            sectors={filterOptions.sectors}
            selectedGrade={filters.selectedGrade}
            gradeDirection={filters.gradeDirection}
            selectedStyles={filters.selectedStyles}
            selectedArea={filters.selectedArea}
            selectedSector={filters.selectedSector}
            onGradeChange={(grade) => updateFilters({ selectedGrade: grade })}
            onGradeDirectionChange={(direction) => updateFilters({ gradeDirection: direction })}
            onStyleChange={handleStyleChange}
            onAreaChange={(area) => updateFilters({ selectedArea: area })}
            onSectorChange={(sector) => updateFilters({ selectedSector: sector })}
          />

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
};
