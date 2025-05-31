
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Mountain, Activity, Users, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessControl } from '@/hooks/useAccessControl';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { hasAccess: canAccess } = useAccessControl();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/routes', icon: Mountain, label: 'BetaBoards' },
    { path: '/trainer', icon: Activity, label: 'Trainer' },
  ];

  // Add conditional nav items
  if (user) {
    navItems.push({ path: '/profile', icon: User, label: 'Profile' });
  }

  // Check if user has admin access - for simplicity, checking if user exists
  // In a real app, you'd check user roles from the profile
  if (user) {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive(path)
                ? 'text-[#E55A2B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
