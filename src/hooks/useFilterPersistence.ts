
import { useState, useEffect } from 'react';
import { ClimbingRoute } from '@/types/routes';

const FILTERS_STORAGE_KEY = 'betaboards-filters';

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

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        setFilters(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
    }
  }, []);

  // Save filters to localStorage whenever they change
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(updatedFilters));
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    try {
      localStorage.removeItem(FILTERS_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved filters:', error);
    }
  };

  return {
    filters,
    updateFilters,
    clearAllFilters
  };
};
