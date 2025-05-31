
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            No Training Data Yet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Your First Training Session
            </h3>
            <p className="text-gray-600 mb-4">
              Complete your first climbing session to see analytics and track your progress.
            </p>
            <p className="text-sm text-gray-500">
              Track climb grades, duration, and number of takes to analyze your performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;
