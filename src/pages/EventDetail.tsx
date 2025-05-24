
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, MapPin, Users, Car, Package, ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
}

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
}

interface Equipment {
  id: string;
  item_name: string;
  brand: string | null;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [userJoined, setUserJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchParticipants();
      fetchEquipment();
    }
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);

      if (user) {
        const { data: participation } = await supabase
          .from('event_participants')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setUserJoined(!!participation);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    }
  };

  const fetchParticipants = async () => {
    try {
      // Fetch event participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;

      // Fetch profile data separately
      if (participantsData && participantsData.length > 0) {
        const userIds = participantsData.map(p => p.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combine the data
        const participantsWithProfiles = participantsData.map(participant => {
          const profile = profilesData?.find(p => p.id === participant.user_id);
          return {
            ...participant,
            full_name: profile?.full_name || 'Unknown User',
            phone: profile?.phone || null,
          };
        });

        setParticipants(participantsWithProfiles);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      // Fetch event equipment
      const { data: eventEquipmentData, error: eventEquipmentError } = await supabase
        .from('event_equipment')
        .select('user_equipment_id, user_id')
        .eq('event_id', eventId);

      if (eventEquipmentError) throw eventEquipmentError;

      if (eventEquipmentData && eventEquipmentData.length > 0) {
        // Fetch user equipment details
        const equipmentIds = eventEquipmentData.map(e => e.user_equipment_id);
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('user_equipment')
          .select(`
            id,
            item_name,
            brand,
            notes,
            user_id,
            category_id
          `)
          .in('id', equipmentIds);

        if (equipmentError) throw equipmentError;

        // Fetch profiles and categories separately
        const userIds = [...new Set(equipmentData?.map(e => e.user_id) || [])];
        const categoryIds = [...new Set(equipmentData?.map(e => e.category_id) || [])];

        const [profilesResult, categoriesResult] = await Promise.all([
          supabase.from('profiles').select('id, full_name').in('id', userIds),
          supabase.from('equipment_categories').select('id, name').in('id', categoryIds)
        ]);

        if (profilesResult.error || categoriesResult.error) {
          throw profilesResult.error || categoriesResult.error;
        }

        // Combine all data
        const equipmentWithDetails = equipmentData?.map(item => {
          const profile = profilesResult.data?.find(p => p.id === item.user_id);
          const category = categoriesResult.data?.find(c => c.id === item.category_id);
          return {
            ...item,
            owner_name: profile?.full_name || 'Unknown User',
            category_name: category?.name || 'Unknown Category',
          };
        }) || [];

        setEquipment(equipmentWithDetails);
      } else {
        setEquipment([]);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async () => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the event",
      });

      setUserJoined(true);
      fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    }
  };

  const leaveEvent = async () => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've left the event",
      });

      setUserJoined(false);
      fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-emerald-600">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Event not found</p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/events')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-emerald-800 mb-2">{event.title}</h1>
              {event.description && (
                <p className="text-stone-600 mb-4">{event.description}</p>
              )}
            </div>
            {event.difficulty_level && (
              <Badge variant="outline" className="ml-4">
                {event.difficulty_level}
              </Badge>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>

              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                {participants.length} participants
                {event.max_participants && ` / ${event.max_participants} max`}
              </div>

              {user && (
                <div className="pt-3">
                  {userJoined ? (
                    <Button 
                      onClick={leaveEvent}
                      variant="outline" 
                      className="w-full"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Leave Event
                    </Button>
                  ) : (
                    <Button 
                      onClick={joinEvent}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Event
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Carpool Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-stone-600">
                {participants.filter(p => p.is_carpool_driver).length > 0 ? (
                  <div>
                    <p className="font-medium mb-2">Available drivers:</p>
                    {participants
                      .filter(p => p.is_carpool_driver)
                      .map(driver => (
                        <div key={driver.id} className="flex justify-between items-center py-1">
                          <span>{driver.full_name}</span>
                          <Badge variant="secondary">
                            {driver.available_seats || 0} seats
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p>No carpool drivers available yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Carpool</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">
                        {participant.full_name}
                      </TableCell>
                      <TableCell>{participant.phone || 'Not provided'}</TableCell>
                      <TableCell>
                        {participant.is_carpool_driver ? (
                          <Badge variant="default">
                            Driver ({participant.available_seats || 0} seats)
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Passenger</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(participant.joined_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-stone-600">
                No participants yet. Be the first to join!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment Available ({equipment.length} items)
            </CardTitle>
            <CardDescription>
              Gear that participants are bringing to share
            </CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.category_name}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.brand || 'N/A'}</TableCell>
                      <TableCell>{item.owner_name}</TableCell>
                      <TableCell className="max-w-xs">
                        {item.notes ? (
                          <span className="text-sm text-stone-600">{item.notes}</span>
                        ) : (
                          <span className="text-stone-400">No notes</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-stone-600">
                No equipment shared yet. Participants can add gear from their profile.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
