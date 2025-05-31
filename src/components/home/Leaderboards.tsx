
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Mountain, Users, Package, Star } from "lucide-react";
import { useLeaderboardManager } from "@/hooks/useLeaderboardManager";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Leaderboards() {
  const { 
    topGradeClimbers, 
    topTradClimbers, 
    topSportClimbers, 
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading,
    refreshLeaderboards
  } = useLeaderboardManager();

  // Set up real-time subscription to refresh leaderboards when attendance changes
  useEffect(() => {
    const channel = supabase
      .channel('leaderboards-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 Attendance approval updated, refreshing leaderboards:', payload);
          refreshLeaderboards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshLeaderboards]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-100 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const leaderboardSections = [
    {
      title: "🏆 Event Enthusiasts",
      icon: Star,
      data: topEventAttendees,
      metric: "Events Attended",
      isGrade: false,
      isProminent: true
    },
    {
      title: "Top Grade Climbers",
      icon: Mountain,
      data: topGradeClimbers,
      metric: "Highest Grade",
      isGrade: true
    },
    {
      title: "Trad Champions",
      icon: Mountain,
      data: topTradClimbers,
      metric: "Trad Routes",
      isGrade: false
    },
    {
      title: "Sport Leaders",
      icon: Mountain,
      data: topSportClimbers,
      metric: "Sport Routes",
      isGrade: false
    },
    {
      title: "Top Rope Masters",
      icon: Mountain,
      data: topTopRopeClimbers,
      metric: "Top Rope Routes",
      isGrade: false
    },
    {
      title: "Gear Collectors",
      icon: Package,
      data: topGearOwners,
      metric: "Equipment Items",
      isGrade: false,
      isGear: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-6 w-6 text-[#E55A2B]" />
          <h2 className="text-2xl font-bold text-[#E55A2B]">Community Leaderboards</h2>
        </div>
        <p className="text-stone-600">Celebrating our most active climbers</p>
      </div>

      {/* Event Enthusiasts - Prominent Display */}
      <div className="mb-8">
        <Card className="border-2 border-[#E55A2B] bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#E55A2B] p-3 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-[#E55A2B]">🏆 Event Enthusiasts</CardTitle>
                <p className="text-sm text-stone-600">Most dedicated event attendees</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topEventAttendees.length > 0 ? (
                topEventAttendees.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-[#E55A2B]">{user.full_name}</span>
                    </div>
                    <Badge variant="outline" className="bg-[#E55A2B] text-white border-[#E55A2B]">
                      {user.metric_value} events
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-500 text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaderboardSections.slice(1).map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <section.icon className="h-4 w-4 text-[#E55A2B]" />
                </div>
                <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.data.length > 0 ? (
                  section.data.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium truncate">{user.full_name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {section.isGrade ? user.metric_value : section.isGear ? `${user.metric_value} items` : `${user.metric_value} ${section.metric.toLowerCase()}`}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500 text-center py-2">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
