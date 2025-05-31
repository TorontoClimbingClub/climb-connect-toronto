
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersDisplayProps {
  selectedGrade: string;
  gradeDirection: 'exact' | 'above' | 'below';
  selectedStyles: string[];
  selectedArea: string;
  selectedSector: string;
  onClearFilter: (filterType: string) => void;
}

/**
 * Component to display and manage active filters
 */
export const ActiveFiltersDisplay = ({
  selectedGrade,
  gradeDirection,
  selectedStyles,
  selectedArea,
  selectedSector,
  onClearFilter
}: ActiveFiltersDisplayProps) => {
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

  if (activeFilters.length === 0) return null;

  return (
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
              onClick={() => onClearFilter(filter.type)}
              className="ml-1 hover:bg-orange-800 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
