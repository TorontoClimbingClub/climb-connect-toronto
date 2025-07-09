import React from 'react';
import { useViewportHeight } from '@/hooks/useViewportHeight';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatContainer({ children, className = '' }: ChatContainerProps) {
  const viewportHeight = useViewportHeight();
  
  return (
    <div 
      className={`w-full flex flex-col bg-white ${className}`}
      style={{
        height: `${viewportHeight}px`,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }}
    >
      {children}
    </div>
  );
}