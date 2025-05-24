
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Package, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

interface CommunityMember {
  id: string;
  full_name: string;
  phone: string | null;
  is_carpool_driver: boolean;
  passenger_capacity: number;
  equipment_count?: number;
  events_count?: number;
}

export default function Community() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  const fetchCommunityMembers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;

      // Get additional stats for each member
      const membersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get equipment count
          const { count: equipmentCount } = await supabase
            .from('user_equipment')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id);

          // Get events count
          const { count: eventsCount } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id);

          return {
            ...profile,
            equipment_count: equipmentCount || 0,
            events_count: eventsCount || 0,
          };
        })
      );

      setMembers(membersWithStats);
    } catch (error) {
      console.error('Error fetching community members:', error);
      toast({
        title: "Error",
        description: "Failed to load community members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-emerald-600">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-emerald-800 mb-2">Community</h1>
          <p className="text-stone-600">Connect with fellow TCC members</p>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-800">{members.length}</p>
              <p className="text-sm text-stone-600">Active Members</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {members.map((member) => (
            <Card key={member.id} className={member.id === user?.id ? "border-emerald-200 bg-emerald-50" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      {member.full_name}
                      {member.id === user?.id && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </h3>
                    {member.phone && (
                      <div className="flex items-center text-sm text-stone-600 mt-1">
                        <Phone className="h-3 w-3 mr-1" />
                        {member.phone}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {member.is_carpool_driver && (
                      <Badge variant="secondary" className="text-xs">
                        <Car className="h-3 w-3 mr-1" />
                        Driver ({member.passenger_capacity} seats)
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-stone-600">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {member.equipment_count} gear items
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {member.events_count} events joined
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
