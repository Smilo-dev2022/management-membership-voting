import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useEvents = () => {
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!userProfile) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: false });

      // TODO: Add role-based filtering for events if necessary

      const { data, error } = await query;

      if (error) throw error;

      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'organiser_id' | 'rsvp_count'>) => {
    if (!userProfile) throw new Error('User must be logged in to create an event.');

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organiser_id: userProfile.id,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchEvents();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const updateEvent = async (eventData: Partial<Event>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventData.id);

      if (error) throw error;

      await fetchEvents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update event');
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      await fetchEvents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchEvents();
    }
  }, [userProfile, fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
