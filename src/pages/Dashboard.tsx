import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '@/integrations/supabase/client';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { ActiveChats } from '@/components/dashboard/ActiveChats';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, upcomingEvents, activeChats, isLoading } = useDashboard();
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'joined'>('all');

  React.useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 h-full overflow-y-auto md:overflow-visible">
      {/* Admin Statistics */}
      {isAdmin && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Statistics</h2>
          </div>
          <StatsGrid stats={stats} isLoading={isLoading} />
        </>
      )}

      {/* Upcoming Events */}
      <UpcomingEvents 
        events={upcomingEvents || []}
        isLoading={isLoading}
        eventFilter={eventFilter}
        onFilterChange={(value: 'all' | 'joined') => setEventFilter(value)}
      />

      {/* Most Active Chats */}
      <ActiveChats 
        chats={activeChats || []}
        isLoading={isLoading}
      />
    </div>
  );
}