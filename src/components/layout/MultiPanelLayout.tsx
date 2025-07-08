import React, { ReactNode } from 'react';
import { DesktopSidebar } from './DesktopSidebar';

interface MultiPanelLayoutProps {
  children: ReactNode;
  contextPanel?: ReactNode;
  layoutType?: 'two-panel' | 'three-panel' | 'four-panel';
  className?: string;
}

interface ContextPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ContextPanel({ title, children, className = '' }: ContextPanelProps) {
  return (
    <div className={`context-panel p-4 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function MultiPanelLayout({ 
  children, 
  contextPanel, 
  layoutType = 'two-panel',
  className = '' 
}: MultiPanelLayoutProps) {
  const getLayoutClass = () => {
    switch (layoutType) {
      case 'three-panel':
        return 'desktop-layout-three-panel';
      case 'four-panel':
        return 'desktop-layout-four-panel';
      default:
        return 'desktop-layout';
    }
  };

  return (
    <div className={`${getLayoutClass()} ${className}`}>
      {/* Desktop Sidebar - Hidden on mobile (below 768px), shown on tablet+ */}
      <div className="sidebar-panel hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Main Content Panel */}
      <div className="main-panel">
        <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Context Panel - Only shown if provided and on tablet+ screens */}
      {contextPanel && (
        <div className="context-panel hidden md:block">
          {contextPanel}
        </div>
      )}
    </div>
  );
}

// Utility components for common context panel content
export function ChatParticipants({ participants }: { participants: Array<{ id: string; name: string; avatar?: string; online?: boolean }> }) {
  return (
    <ContextPanel title="Participants">
      <div className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {participant.avatar ? (
                  <img src={participant.avatar} alt={participant.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="text-xs font-medium">{participant.name[0]}</span>
                )}
              </div>
              {participant.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {participant.name}
              </p>
              <p className="text-xs text-gray-500">
                {participant.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContextPanel>
  );
}

export function EventDetails({ event }: { 
  event: {
    title: string;
    description?: string;
    location: string;
    date: string;
    participants: number;
    maxParticipants?: number;
  }
}) {
  return (
    <ContextPanel title="Event Details">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-gray-600">{event.description}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-16">Date:</span>
            <span className="text-gray-600">{event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-16">Location:</span>
            <span className="text-gray-600">{event.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-16">Spots:</span>
            <span className="text-gray-600">
              {event.participants}{event.maxParticipants ? ` / ${event.maxParticipants}` : ''}
            </span>
          </div>
        </div>
      </div>
    </ContextPanel>
  );
}


export function ActivityFeed({ activities }: {
  activities: Array<{
    id: string;
    type: string;
    content: string;
    user: string;
    timestamp: string;
  }>
}) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <ContextPanel title="Recent Activity">
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-2 border-green-200 pl-3">
            <p className="text-sm text-gray-900 font-medium">{activity.content}</p>
            <p className="text-xs text-gray-500">
              by {activity.user} • {formatTimeAgo(activity.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </ContextPanel>
  );
}