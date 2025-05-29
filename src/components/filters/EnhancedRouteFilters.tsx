
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, AlertTriangle } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { FilterSelect } from "./FilterSelect";
import { sortGrades } from "./GradeSorter";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EnhancedRouteFiltersProps {
  routes: ClimbingRoute[];
  onFiltersChange: (filteredRoutes: ClimbingRoute[]) => void;
  selectedSector?: string | null;
}

export const EnhancedRouteFilters = ({ routes, onFiltersChange, selectedSector }: EnhancedRouteFiltersProps) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [gradeDirection, setGradeDirection] = useState<"exact" | "above" | "below">("exact");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedFilterSector, setSelectedFilterSector] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filter options with proper sorting
  const grades = sortGrades([...new Set(routes.map(route => route.grade))]);
  const styles = [...new Set(routes.map(route => route.style))];
  const areas = [...new Set(routes.map(route => route.area))].sort();
  const sectors = [...new Set(routes.map(route => route.sector))].sort();

  // Check if selected area conflicts with current sector
  const hasAreaSectorConflict = selectedArea && selectedSector && 
    !routes.some(route => route.area === selectedArea && route.sector === selectedSector);

  const applyFilters = () => {
    let filtered = routes;

    // Grade filtering with direction
    if (selectedGrade) {
      const gradeIndex = grades.indexOf(selectedGrade);
      
      if (gradeDirection === "exact") {
        filtered = filtered.filter(route => route.grade === selectedGrade);
      } else if (gradeDirection === "above") {
        const validGrades = grades.slice(gradeIndex);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      } else if (gradeDirection === "below") {
        const validGrades = grades.slice(0, gradeIndex + 1);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      }
    }

    // Style filtering (multiple selection)
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(route => selectedStyles.includes(route.style));
    }

    // Area filtering
    if (selectedArea) {
      filtered = filtered.filter(route => route.area === selectedArea);
    }

    // Sector filtering
    if (selectedFilterSector) {
      filtered = filtered.filter(route => route.sector === selectedFilterSector);
    }

    console.log('Applied filters:', {
      selectedGrade,
      gradeDirection,
      selectedStyles,
      selectedArea,
      selectedFilterSector,
      resultCount: filtered.length
    });

    onFiltersChange(filtered);
  };

  const clearFilters = () => {
    setSelectedGrade("");
    setGradeDirection("exact");
    setSelectedStyles([]);
    setSelectedArea("");
    setSelectedFilterSector("");
    onFiltersChange(routes);
  };

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case 'grade':
        setSelectedGrade("");
        setGradeDirection("exact");
        break;
      case 'styles':
        setSelectedStyles([]);
        break;
      case 'area':
        setSelectedArea("");
        break;
      case 'sector':
        setSelectedFilterSector("");
        break;
    }
    
    // Apply filters after state update
    setTimeout(() => applyFilters(), 0);
  };

  // Apply filters automatically when any filter changes
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleGradeDirectionChange = (value: string) => {
    setGradeDirection(value as "exact" | "above" | "below");
    setTimeout(() => applyFilters(), 0);
  };

  const handleStyleToggle = (style: string, checked: boolean) => {
    const newStyles = checked 
      ? [...selectedStyles, style]
      : selectedStyles.filter(s => s !== style);
    setSelectedStyles(newStyles);
    setTimeout(() => applyFilters(), 0);
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setTimeout(() => applyFilters(), 0);
  };

  const handleSectorChange = (value: string) => {
    setSelectedFilterSector(value);
    setTimeout(() => applyFilters(), 0);
  };

  const hasActiveFilters = Boolean(
    selectedGrade || 
    selectedStyles.length > 0 || 
    selectedArea || 
    selectedFilterSector
  );

  const activeFilters = [
    selectedGrade && { 
      type: 'grade', 
      label: 'Grade', 
      value: `${selectedGrade} ${gradeDirection !== 'exact' ? `(${gradeDirection})` : ''}` 
    },
    selectedStyles.length > 0 && { 
      type: 'styles', 
      label: 'Styles', 
      value: selectedStyles.join(', ') 
    },
    selectedArea && { type: 'area', label: 'Area', value: selectedArea },
    selectedFilterSector && { type: 'sector', label: 'Sector', value: selectedFilterSector },
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

        {/* Area/Sector Conflict Warning */}
        {hasAreaSectorConflict && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Warning: Selected area "{selectedArea}" is not in the current sector "{selectedSector}". 
                This filter combination may return no results.
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Grade Filter with Direction */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Grade</label>
            <div className="grid grid-cols-2 gap-2">
              <FilterSelect
                value={selectedGrade}
                onValueChange={handleGradeChange}
                placeholder="Any grade"
                label=""
                options={grades}
              />
              {selectedGrade && (
                <Select value={gradeDirection} onValueChange={handleGradeDirectionChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exactly {selectedGrade}</SelectItem>
                    <SelectItem value="above">{selectedGrade} and above</SelectItem>
                    <SelectItem value="below">{selectedGrade} and below</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Style Filter with Multiple Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Climbing Styles</label>
            <div className="space-y-2">
              {styles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={style}
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={(checked) => handleStyleToggle(style, checked as boolean)}
                  />
                  <label htmlFor={style} className="text-sm">{style}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Area and Sector Filters */}
          <div className="grid grid-cols-2 gap-3">
            <FilterSelect
              value={selectedArea}
              onValueChange={handleAreaChange}
              placeholder="Any area"
              label="Area"
              options={areas}
            />

            <FilterSelect
              value={selectedFilterSector}
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
