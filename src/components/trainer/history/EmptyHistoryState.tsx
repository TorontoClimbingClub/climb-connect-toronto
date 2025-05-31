
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Mountain, Search } from 'lucide-react';

interface EmptyHistoryStateProps {
  type: 'no-sessions' | 'no-results';
}

const EmptyHistoryState = ({ type }: EmptyHistoryStateProps) => {
  if (type === 'no-sessions') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mountain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sessions Yet</h3>
            <p className="text-gray-500">
              Complete your first training session to see it appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="text-center py-8">
        <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sessions Found</h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyHistoryState;
