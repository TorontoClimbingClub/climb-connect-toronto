import { supabase } from '@/integrations/supabase/client';

export class EventService {
  static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        location,
        event_date,
        max_participants,
        created_by,
        created_at,
        profiles!created_by (display_name)
      `)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getEventParticipants(eventId: string) {
    const { data, error } = await supabase
      .from('event_participants')
      .select('user_id, profiles(display_name, avatar_url)')
      .eq('event_id', eventId);

    if (error) throw error;
    return data;
  }

  static async joinEvent(eventId: string, userId: string) {
    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId });

    if (error) throw error;
  }

  static async leaveEvent(eventId: string, userId: string) {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async deleteEvent(eventId: string, userId: string) {
    // First, verify the user is the creator
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single();

    if (fetchError) throw fetchError;
    
    if (event.created_by !== userId) {
      throw new Error('Only the event creator can delete the event');
    }

    // Check if there's only one participant (should be the creator)
    const { count, error: countError } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (countError) throw countError;

    if (count && count > 1) {
      throw new Error('Cannot delete event with multiple participants');
    }

    // Delete participants first
    const { error: participantsError } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId);

    if (participantsError) throw participantsError;

    // Delete event messages
    const { error: messagesError } = await supabase
      .from('event_messages')
      .delete()
      .eq('event_id', eventId);

    if (messagesError) throw messagesError;

    // Delete the event itself
    const { error: eventError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (eventError) throw eventError;
  }
}