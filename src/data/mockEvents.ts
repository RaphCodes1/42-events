'use client';
import { Event } from '../types';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import useEventsStore from '../store/eventsStore';

// Helper to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

// Default mock data for development
const defaultMockEvents: Event[] = [
];

export let mockEvents: Event[] = [...defaultMockEvents];

// Function to insert initial data into the database
export const insertInitialData = async () => {
  console.log('Attempting to insert initial data...');
  try {
    // First check if we already have data
    const { data: existingData, error: checkError } = await supabase
      .from('event_data')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('Data already exists in database, skipping initial data insertion');
      return;
    }

    // Insert each mock event into the database
    for (const event of defaultMockEvents) {
      const { error: insertError } = await supabase
        .from('event_data')
        .insert({
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          category: event.category,
          created_at: event.createdAt
        });

      if (insertError) {
        console.error('Error inserting event:', {
          event: event.title,
          error: insertError
        });
      } else {
        console.log('Successfully inserted event:', event.title);
      }
    }
    console.log('Initial data insertion completed');
  } catch (error) {
    console.error('Unexpected error during initial data insertion:', error);
  }
};

export const fetchEvents = async () => {
  console.log('Starting fetchEvents...');
  try {
    console.log('Attempting to fetch events from Supabase...');
    const { data, error } = await supabase
      .from('event_data')
      .select('*');
      
    if (error) {
      console.error('Error fetching events from Supabase:', {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      console.log('Falling back to mock data due to error');
      useEventsStore.getState().setEvents(mockEvents);
      return;
    }

    console.log('Supabase response received:', {
      dataLength: data?.length ?? 0,
      hasData: !!data,
      firstEvent: data?.[0] ? {
        id: data[0].id,
        title: data[0].title,
        date: data[0].date
      } : null
    });

    if (data && data.length > 0) {
      console.log('Processing fetched events...');
      const events = data.map((event): Event => ({
        id: String(event.id),
        title: event.title,
        description: event.description,
        date: String(event.date),
        location: event.location,
        category: event.category,
        createdAt: String(event.created_at),
      }));
      
      console.log('Events processed successfully:', {
        totalEvents: events.length,
        categories: [...new Set(events.map(e => e.category))],
        dateRange: {
          earliest: events.reduce((a, b) => new Date(a.date) < new Date(b.date) ? a : b).date,
          latest: events.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date
        }
      });

      mockEvents = events;
      useEventsStore.getState().setEvents(events);
      console.log('Events stored in state successfully');
    } else {
      console.log('No events found in database, using mock data');
      useEventsStore.getState().setEvents(mockEvents);
    }
  } catch (error) {
    console.error('Unexpected error in fetchEvents:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    console.log('Falling back to mock data due to unexpected error');
    useEventsStore.getState().setEvents(mockEvents);
  }
  console.log('fetchEvents completed');
};
