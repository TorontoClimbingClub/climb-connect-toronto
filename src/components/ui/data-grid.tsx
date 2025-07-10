import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DataGridItem {
  id: string;
  [key: string]: any;
}

interface DataGridProps<T extends DataGridItem> {
  data: T[];
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
  className?: string;
  itemClassName?: string | ((item: T) => string);
}

export function DataGrid<T extends DataGridItem>({
  data,
  isLoading = false,
  error = null,
  emptyState,
  renderItem,
  renderActions,
  onItemClick,
  className = '',
  itemClassName = ''
}: DataGridProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-sm">{error.message}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            {emptyState.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{emptyState.title}</h3>
          <p className="text-muted-foreground">{emptyState.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((item) => {
        const computedClassName = typeof itemClassName === 'function' ? itemClassName(item) : itemClassName;
        return (
        <Card 
          key={item.id} 
          className={`transition-all hover:shadow-lg ${computedClassName} ${
            onItemClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {renderItem(item)}
              </div>
              {renderActions && (
                <div className="ml-4" onClick={e => e.stopPropagation()}>
                  {renderActions(item)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
}