export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  createdAt: string;
}

export interface fromDatabase {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
}

export type EventCategory = 'conference' | 'workshop' | 'meetup' | 'exhibition' | 'other';

export type SortOption = 'title-asc' | 'title-desc' | 'date-asc' | 'date-desc' | 'created-asc' | 'created-desc';

export interface UserState {
  subscribedEvents: string[];
  subscribe: (eventId: string) => void;
  unsubscribe: (eventId: string) => void;
  isSubscribed: (eventId: string) => boolean;
}

export interface EventsState {
  events: Event[];
  filteredEvents: Event[];
  searchTerm: string;
  sortOption: SortOption;
  categoryFilter: EventCategory | 'all';
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setCategoryFilter: (category: EventCategory | 'all') => void;
  addEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
}