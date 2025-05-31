
import { useState, useCallback, useMemo } from 'react';
import { ClimbingRoute } from '@/types/routes';
import { sortGrades } from '@/components/filters/GradeSorter';

interface FilterState {
  selectedGrade: string;
  gradeDirection: 'exact' | 'above' | 'below';
  selectedStyles: string[];
  selectedArea: string;
  selectedSector: string;
  isExpanded: boolean;
}

const defaultFilters: FilterState = {
  selectedGrade: '',
  gradeDirection: 'exact',
  selectedStyles: [],
  selectedArea: '',
  selectedSector: '',
  isExpanded: false
};

/**
 * Optimized hook for managing route filters with memoized calculations
 */
export const useRouteFilters = (routes: ClimbingRoute[]) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Memoize filtered routes to prevent unnecessary recalculations
  const filteredRoutes = useMemo(() => {
    let filtered = routes;

    if (filters.selectedGrade) {
      const grades = sortGrades([...new Set(routes.map(route => route.grade))]);
      
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

    return filtered;
  }, [routes, filters]);

  // Memoize filter options to prevent unnecessary recalculations
  const filterOptions = useMemo(() => ({
    grades: sortGrades([...new Set(routes.map(route => route.grade))]),
    styles: [...new Set(routes.map(route => route.style))],
    areas: [...new Set(routes.map(route => route.area))].sort(),
    sectors: [...new Set(routes.map(route => route.sector))].sort()
  }), [routes]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(current => ({ ...current, ...newFilters }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(current => ({ ...defaultFilters, isExpanded: current.isExpanded }));
  }, []);

  const clearIndividualFilter = useCallback((filterType: keyof FilterState) => {
    switch (filterType) {
      case 'selectedGrade':
        updateFilters({ selectedGrade: '', gradeDirection: 'exact' });
        break;
      case 'selectedStyles':
        updateFilters({ selectedStyles: [] });
        break;
      case 'selectedArea':
        updateFilters({ selectedArea: '' });
        break;
      case 'selectedSector':
        updateFilters({ selectedSector: '' });
        break;
    }
  }, [updateFilters]);

  const hasActiveFilters = useMemo(() => 
    Boolean(filters.selectedGrade || filters.selectedStyles.length > 0 || filters.selectedArea || filters.selectedSector),
    [filters]
  );

  const hasAreaSectorConflict = useMemo(() => 
    filters.selectedArea && filters.selectedSector && 
    !routes.some(route => route.area === filters.selectedArea && route.sector === filters.selectedSector),
    [filters.selectedArea, filters.selectedSector, routes]
  );

  return {
    filters,
    filteredRoutes,
    filterOptions,
    hasActiveFilters,
    hasAreaSectorConflict,
    updateFilters,
    clearAllFilters,
    clearIndividualFilter
  };
};
