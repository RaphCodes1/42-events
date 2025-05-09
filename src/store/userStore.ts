import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from '../types';

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      subscribedEvents: [],
      
      subscribe: (eventId) => {
        const { subscribedEvents } = get();
        if (!subscribedEvents.includes(eventId)) {
          set({ subscribedEvents: [...subscribedEvents, eventId] });
        }
      },
      
      unsubscribe: (eventId) => {
        const { subscribedEvents } = get();
        set({ 
          subscribedEvents: subscribedEvents.filter(id => id !== eventId) 
        });
      },
      
      isSubscribed: (eventId) => {
        return get().subscribedEvents.includes(eventId);
      },
    }),
    {
      name: 'user-preferences',
    }
  )
);

export default useUserStore;