import { create } from 'zustand';
import { Event, EventsState, SortOption, EventCategory } from '../types';
import { mockEvents } from '../data/mockEvents';

const sortEvents = (events: Event[], sortOption: SortOption): Event[] => {
  const eventsCopy = [...events];
  
  switch (sortOption) {
    case 'title-asc':
      return eventsCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return eventsCopy.sort((a, b) => b.title.localeCompare(a.title));
    case 'date-asc':
      return eventsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'date-desc':
      return eventsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'created-asc':
      return eventsCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'created-desc':
      return eventsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return eventsCopy;
  }
};

const filterEvents = (
  events: Event[], 
  searchTerm: string, 
  categoryFilter: EventCategory | 'all'
): Event[] => {
  return events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
};

const useEventsStore = create<EventsState>()((set, get) => ({
  events: mockEvents,
  filteredEvents: mockEvents,
  searchTerm: '',
  sortOption: 'date-asc',
  categoryFilter: 'all',
  
  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    const { events, sortOption, categoryFilter } = get();
    const filtered = filterEvents(events, searchTerm, categoryFilter);
    set({ filteredEvents: sortEvents(filtered, sortOption) });
  },
  
  setSortOption: (sortOption) => {
    set({ sortOption });
    const { filteredEvents } = get();
    set({ filteredEvents: sortEvents(filteredEvents, sortOption) });
  },
  
  setCategoryFilter: (categoryFilter) => {
    set({ categoryFilter });
    const { events, searchTerm, sortOption } = get();
    const filtered = filterEvents(events, searchTerm, categoryFilter);
    set({ filteredEvents: sortEvents(filtered, sortOption) });
  },
}));

export default useEventsStore;