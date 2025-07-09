import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Mountain, 
  Hash, 
  Users, 
  MessageCircle, 
  Calendar, 
  Home,
  UserCheck
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  active?: boolean;
}

export function DesktopSidebar() {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const location = useLocation();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar, badge: unreadCounts.events },
    { name: 'Belay Groups', href: '/belay-groups', icon: UserCheck, badge: unreadCounts.belayGroups },
    { name: 'Club Talk', href: '/club-talk', icon: Hash, badge: unreadCounts.clubTalk },
    { name: 'Gym Groups', href: '/groups', icon: Users, badge: unreadCounts.groups },
    { name: 'Community', href: '/chat', icon: MessageCircle, badge: unreadCounts.community },
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



  return (
    <div className="sidebar-panel p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Mountain className="h-6 w-6 text-green-600" />
        <span className="font-bold text-green-800">TCC</span>
      </div>

      {/* User Profile */}
      <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 mb-6 hover:bg-green-100 transition-colors cursor-pointer">
        <Avatar className="h-12 w-12">
          <AvatarImage src={userProfile?.avatar_url} />
          <AvatarFallback>
            {userProfile?.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userProfile?.display_name}
          </p>
        </div>
      </Link>

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