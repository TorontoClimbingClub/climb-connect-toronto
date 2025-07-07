import React from 'react';
import { Card } from '@/components/ui/card';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className = ''
}: LoadingSpinnerProps) {
  return (
    <Card className={`h-full flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="text-gray-500">{message}</div>
      </div>
    </Card>
  );
}