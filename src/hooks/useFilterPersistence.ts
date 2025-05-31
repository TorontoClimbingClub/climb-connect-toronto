
import { useState } from 'react';

interface FilterState {
  selectedGrade: string;
  gradeDirection: 'exact' | 'above' | 'below';
  selectedStyles: string[];
  selectedArea: string;
  selectedSector: string;
}

const defaultFilters: FilterState = {
  selectedGrade: '',
  gradeDirection: 'exact',
  selectedStyles: [],
  selectedArea: '',
  selectedSector: ''
};

export const useFilterPersistence = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    updateFilters,
    clearAllFilters
  };
};
