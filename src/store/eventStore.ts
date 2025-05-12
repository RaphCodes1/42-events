import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Event } from '../types';

interface EventStore {
  events: Event[];
  filteredEvents: Event[];
  searchTerm: string;
  sortOption: 'date' | 'title';
  categoryFilter: string;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: 'date' | 'title') => void;
  setCategoryFilter: (category: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  filteredEvents: [],
  searchTerm: '',
  sortOption: 'date',
  categoryFilter: 'all',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortOption: (option) => set({ sortOption: option }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  addEvent: async (event: Omit<Event, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('events_data')
        .insert([{ ...event, id: crypto.randomUUID() }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        events: [...state.events, data],
        filteredEvents: [...state.filteredEvents, data],
      }));

      return data;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },
  deleteEvent: async (id: string) => {
    try {
      const { error } = await supabase
        .from('events_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        events: state.events.filter(event => event.id !== id),
        filteredEvents: state.filteredEvents.filter(event => event.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
})); 