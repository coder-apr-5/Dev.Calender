import { create } from 'zustand';
import { CalendarEvent } from '../../app/types';

interface CalendarStore {
  events: CalendarEvent[];
  currentView: 'work' | 'personal' | 'combined';
  theme: 'light' | 'dark';
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  setCurrentView: (view: 'work' | 'personal' | 'combined') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<CalendarStore>((set) => ({
  events: [],
  currentView: 'combined',
  theme: 'light',
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, { ...event, id: crypto.randomUUID() }],
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  setCurrentView: (view) => set({ currentView: view }),
  setTheme: (theme) => set({ theme }),
}));