import React, { useState, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { DataGrid } from './data-grid';

interface SearchableItem {
  id: string;
  [key: string]: any;
}

interface SearchableListProps<T extends SearchableItem> {
  data: T[];
  searchFields: (keyof T)[];
  searchPlaceholder?: string;
  isLoading?: boolean;
  error?: Error | null;
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  renderItem: (item: T) => ReactNode;
  renderActions?: (item: T) => ReactNode;
  onItemClick?: (item: T) => void;
  filters?: ReactNode;
  className?: string;
  itemClassName?: string | ((item: T) => string);
}

export function SearchableList<T extends SearchableItem>({
  data,
  searchFields,
  searchPlaceholder = 'Search...',
  isLoading = false,
  error = null,
  emptyState,
  renderItem,
  renderActions,
  onItemClick,
  filters,
  className = '',
  itemClassName = ''
}: SearchableListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  }, [data, searchFields, searchTerm]);

  const emptySearchState = searchTerm ? {
    icon: <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />,
    title: 'No results found',
    description: `No items match "${searchTerm}". Try adjusting your search terms.`
  } : emptyState;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {filters && (
              <div className="flex gap-2">
                {filters}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <DataGrid
        data={filteredData}
        isLoading={isLoading}
        error={error}
        emptyState={emptySearchState}
        renderItem={renderItem}
        renderActions={renderActions}
        onItemClick={onItemClick}
        itemClassName={typeof itemClassName === 'function' ? undefined : itemClassName}
      />
    </div>
  );
}