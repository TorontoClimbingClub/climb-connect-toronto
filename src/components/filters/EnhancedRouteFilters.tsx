
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, ChevronDown } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { sortGrades } from "./GradeSorter";

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
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [gradeDirection, setGradeDirection] = useState<GradeDirection>('exact');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");

  const isExpanded = externalExpanded ?? false;

  // Get unique values for filter options with proper sorting
  const grades = sortGrades([...new Set(routes.map(route => route.grade))]);
  const styles = [...new Set(routes.map(route => route.style))];
  const areas = [...new Set(routes.map(route => route.area))].sort();
  const sectors = [...new Set(routes.map(route => route.sector))].sort();

  // Check for area/sector conflicts
  const hasAreaSectorConflict = selectedArea && selectedSector && 
    !routes.some(route => route.area === selectedArea && route.sector === selectedSector);

  const applyFilters = () => {
    let filtered = routes;

    if (selectedGrade) {
      if (gradeDirection === 'exact') {
        filtered = filtered.filter(route => route.grade === selectedGrade);
      } else if (gradeDirection === 'above') {
        const gradeIndex = grades.indexOf(selectedGrade);
        const validGrades = grades.slice(gradeIndex);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      } else if (gradeDirection === 'below') {
        const gradeIndex = grades.indexOf(selectedGrade);
        const validGrades = grades.slice(0, gradeIndex + 1);
        filtered = filtered.filter(route => validGrades.includes(route.grade));
      }
    }

    if (selectedStyles.length > 0) {
      filtered = filtered.filter(route => selectedStyles.includes(route.style));
    }

    if (selectedArea) {
      filtered = filtered.filter(route => route.area === selectedArea);
    }

    if (selectedSector) {
      filtered = filtered.filter(route => route.sector === selectedSector);
    }

    onFiltersChange(filtered);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedGrade, gradeDirection, selectedStyles, selectedArea, selectedSector]);

  const clearAllFilters = () => {
    setSelectedGrade("");
    setGradeDirection('exact');
    setSelectedStyles([]);
    setSelectedArea("");
    setSelectedSector("");
  };

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case 'grade':
        setSelectedGrade("");
        setGradeDirection('exact');
        break;
      case 'styles':
        setSelectedStyles([]);
        break;
      case 'area':
        setSelectedArea("");
        break;
      case 'sector':
        setSelectedSector("");
        break;
    }
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const newStyles = checked 
      ? [...selectedStyles, style]
      : selectedStyles.filter(s => s !== style);
    setSelectedStyles(newStyles);
  };

  const hasActiveFilters = Boolean(selectedGrade || selectedStyles.length > 0 || selectedArea || selectedSector);
  const activeFilters = [
    selectedGrade && { 
      type: 'grade', 
      label: 'Grade', 
      value: gradeDirection === 'exact' ? selectedGrade : `${selectedGrade} ${gradeDirection}` 
    },
    selectedStyles.length > 0 && { 
      type: 'styles', 
      label: 'Styles', 
      value: selectedStyles.join(', ') 
    },
    selectedArea && { type: 'area', label: 'Area', value: selectedArea },
    selectedSector && { type: 'sector', label: 'Sector', value: selectedSector },
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
              ⚠️ Warning: The selected area "{selectedArea}" is not in sector "{selectedSector}". 
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
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
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
              {selectedGrade && (
                <Select value={gradeDirection} onValueChange={(value: GradeDirection) => setGradeDirection(value)}>
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
                    checked={selectedStyles.includes(style)}
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
              <Label>Sector</Label>
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
