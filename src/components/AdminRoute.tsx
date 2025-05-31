
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAccessControl } from '@/hooks/useAccessControl';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { hasAccess, accessLoading } = useAccessControl('admin');
  
  console.log('🛡️ AdminRoute check:', {
    hasAccess,
    accessLoading,
    route: window.location.pathname
  });
  
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Checking permissions...</div>
      </div>
    );
  }
  
  if (!hasAccess) {
    console.warn('🚫 AdminRoute: Redirecting unauthorized user');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
