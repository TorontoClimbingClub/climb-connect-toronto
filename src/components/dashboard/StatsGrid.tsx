import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, MessageSquare, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/hooks/useDashboard';

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="desktop-grid-4 md:desktop-grid-2 lg:desktop-grid-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="desktop-card-hover animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="desktop-grid-4 md:desktop-grid-2 lg:desktop-grid-4">
      <Card className="desktop-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total events created
          </p>
        </CardContent>
      </Card>

      <Card className="desktop-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalGroups || 0}</div>
          <p className="text-xs text-muted-foreground">
            Active climbing groups
          </p>
        </CardContent>
      </Card>

      <Card className="desktop-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
          <p className="text-xs text-muted-foreground">
            Community messages
          </p>
        </CardContent>
      </Card>

      <Card className="desktop-card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Community Members</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
          <p className="text-xs text-muted-foreground">
            Registered members
          </p>
        </CardContent>
      </Card>
    </div>
  );
}