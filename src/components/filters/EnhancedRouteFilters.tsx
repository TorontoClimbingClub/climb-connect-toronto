
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, ChevronDown } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { sortGrades } from "./GradeSorter";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";

interface EnhancedRouteFiltersProps {
  routes: ClimbingRoute[];
  onFiltersChange: (filteredRoutes: ClimbingRoute[]) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

type GradeDirection = 'exact' | 'above' | 'below';

export const EnhancedRouteFilters = ({ 
  routes, 
  onFiltersChange, 
  isExpanded: externalExpanded,
  onExpandedChange 
}: EnhancedRouteFiltersProps) => {
  const { filters, updateFilters, clearAllFilters } = useFilterPersistence();
  const isExpanded = externalExpanded ?? false;

  // Get unique values for filter options with proper sorting
  const grades = sortGrades([...new Set(routes.map(route => route.grade))]);
  const styles = [...new Set(routes.map(route => route.style))];
  const areas = [...new Set(routes.map(route => route.area))].sort();
  const sectors = [...new Set(routes.map(route => route.sector))].sort();

  // Check for area/sector conflicts
  const hasAreaSectorConflict = filters.selectedArea && filters.selectedSector && 
    !routes.some(route => route.area === filters.selectedArea && route.sector === filters.selectedSector);

  const applyFilters = () => {
    let filtered = routes;

    if (filters.selectedGrade) {
      if (filters.gradeDirection === 'exact') {
        filtered = filtered.filter(route => route.grade === filters.selectedGrade);
      } else if (filters.gradeDirection === 'above') {
        const gradeIndex = grades.indexOf(filters.selectedGrade);
        const validGrades = grades.slice(gradeIndex);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      } else if (filters.gradeDirection === 'below') {
        const gradeIndex = grades.indexOf(filters.selectedGrade);
        const validGrades = grades.slice(0, gradeIndex + 1);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      }
    }

    if (filters.selectedStyles.length > 0) {
      filtered = filtered.filter(route => filters.selectedStyles.includes(route.style));
    }

    if (filters.selectedArea) {
      filtered = filtered.filter(route => route.area === filters.selectedArea);
    }

    if (filters.selectedSector) {
      filtered = filtered.filter(route => route.sector === filters.selectedSector);
    }

    onFiltersChange(filtered);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [filters.selectedGrade, filters.gradeDirection, filters.selectedStyles, filters.selectedArea, filters.selectedSector]);

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case 'grade':
        updateFilters({ selectedGrade: "", gradeDirection: 'exact' });
        break;
      case 'styles':
        updateFilters({ selectedStyles: [] });
        break;
      case 'area':
        updateFilters({ selectedArea: "" });
        break;
      case 'sector':
        updateFilters({ selectedSector: "" });
        break;
    }
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked 
      ? [...filters.selectedStyles, style]
      : filters.selectedStyles.filter(s => s !== style);
    updateFilters({ selectedStyles: newStyles });
  };

  const hasActiveFilters = Boolean(filters.selectedGrade || filters.selectedStyles.length > 0 || filters.selectedArea || filters.selectedSector);
  const activeFilters = [
    filters.selectedGrade && { 
      type: 'grade', 
      label: 'Grade', 
      value: filters.gradeDirection === 'exact' ? filters.selectedGrade : `${filters.selectedGrade} ${filters.gradeDirection}` 
    },
    filters.selectedStyles.length > 0 && { 
      type: 'styles', 
      label: 'Styles', 
      value: filters.selectedStyles.join(', ') 
    },
    filters.selectedArea && { type: 'area', label: 'Area', value: filters.selectedArea },
    filters.selectedSector && { type: 'sector', label: 'Sector', value: filters.selectedSector },
  ].filter(Boolean);

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
                {activeFilters.length}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
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
          {/* Grade Filter */}
          <div className="space-y-2">
            <Label>Grade</Label>
            <div className="flex gap-2">
              <Select value={filters.selectedGrade} onValueChange={(value) => updateFilters({ selectedGrade: value })}>
                <SelectTrigger className="flex-1">
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
              {filters.selectedGrade && (
                <Select value={filters.gradeDirection} onValueChange={(value: GradeDirection) => updateFilters({ gradeDirection: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exact</SelectItem>
                    <SelectItem value="above">& Above</SelectItem>
                    <SelectItem value="below">& Below</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Style Filter */}
          <div className="space-y-2">
            <Label>Styles (select multiple)</Label>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={style}
                    checked={filters.selectedStyles.includes(style)}
                    onCheckedChange={(checked) => handleStyleChange(style, checked as boolean)}
                  />
                  <Label htmlFor={style} className="text-sm cursor-pointer">
                    {style}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Area and Sector Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Area</Label>
              <Select value={filters.selectedArea} onValueChange={(value) => updateFilters({ selectedArea: value })}>
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
              <Label>Sector</Label>
              <Select value={filters.selectedSector} onValueChange={(value) => updateFilters({ selectedSector: value })}>
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
}
