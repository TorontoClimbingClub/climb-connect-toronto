import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Mountain, 
  Hash, 
  Users, 
  MessageCircle, 
  Calendar, 
  Home,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  active?: boolean;
}



export function DesktopSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Hide completely on mobile - should never show below 768px
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const { user } = useAuth();
  const location = useLocation();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Club Talk', href: '/club-talk', icon: Hash, badge: unreadCounts.clubTalk },
    { name: 'Gym Groups', href: '/groups', icon: Users, badge: unreadCounts.groups },
    { name: 'Community', href: '/chat', icon: MessageCircle, badge: unreadCounts.community },
    { name: 'Events', href: '/events', icon: Calendar, badge: unreadCounts.events },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Load unread counts
  useEffect(() => {
    loadUnreadCounts();

    // Set up real-time subscriptions
    const interval = setInterval(() => {
      loadUnreadCounts();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user]);


  const loadUnreadCounts = async () => {
    // Real implementation would calculate from message tables
    // For now, show no unread counts until real-time messaging is implemented
    setUnreadCounts({});
  };


  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="sidebar-panel w-16 p-2">
        <div className="flex flex-col items-center space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-panel p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Mountain className="h-6 w-6 text-green-600" />
          <span className="font-bold text-green-800">TCC</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="p-1"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user?.user_metadata?.display_name?.[0] || user?.email?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.user_metadata?.display_name || user?.email}
          </p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <Badge variant="destructive" className="h-5 text-xs">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>



    </div>
  );
}