
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const EmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Training Data Yet</h3>
          <p className="text-gray-500">
            Complete some training sessions to see your analytics and progress charts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
