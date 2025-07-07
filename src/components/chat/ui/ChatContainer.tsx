import React from 'react';
import { Card } from '@/components/ui/card';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ChatContainer({
  children,
  className = '',
  style
}: ChatContainerProps) {
  return (
    <Card 
      className={`h-full w-full flex flex-col border-0 rounded-none bg-white ${className}`}
      style={style}
    >
      {children}
    </Card>
  );
}