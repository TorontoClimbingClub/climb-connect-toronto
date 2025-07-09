import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeService {
  private static channels = new Map<string, RealtimeChannel>();

  static subscribeToTable(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE',
    callback: (payload: any) => void,
    filter?: { column: string; value: string }
  ) {
    const channelName = `${table}-${event}${filter ? `-${filter.column}-${filter.value}` : ''}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(`schema-db-changes-${channelName}`)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  static unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  static unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  // Specific subscription helpers
  static subscribeToEventMessages(eventId: string, callback: (payload: any) => void) {
    return this.subscribeToTable('event_messages', 'INSERT', callback, {
      column: 'event_id',
      value: eventId
    });
  }

  static subscribeToGroupMessages(groupId: string, callback: (payload: any) => void) {
    return this.subscribeToTable('group_messages', 'INSERT', callback, {
      column: 'group_id',
      value: groupId
    });
  }

  static subscribeToClubMessages(callback: (payload: any) => void) {
    return this.subscribeToTable('club_messages', 'INSERT', callback);
  }

  static subscribeToEvents(callback: (payload: any) => void) {
    return this.subscribeToTable('events', 'INSERT', callback);
  }

  static subscribeToGroups(callback: (payload: any) => void) {
    return this.subscribeToTable('groups', 'INSERT', callback);
  }
}