import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children?: React.ReactNode; // For additional header controls
  className?: string;
}

export function ChatHeader({ 
  title, 
  subtitle, 
  onBack, 
  children,
  className = '' 
}: ChatHeaderProps) {
  return (
    <div className={`p-4 border-b flex items-center justify-between flex-shrink-0 bg-white ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}