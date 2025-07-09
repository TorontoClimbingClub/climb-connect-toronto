import React, { useEffect, useRef } from 'react';
import { useMobileViewport } from '@/utils/mobileViewport';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChatContainer({ children, className = '' }: ChatContainerProps) {
  const viewportState = useMobileViewport();
  
  return (
    <div className={`w-full flex flex-col bg-white ${
      viewportState.isMobile ? 'chat-container h-screen' : 'h-full'
    } ${className}`}>
      {children}
    </div>
  );
}