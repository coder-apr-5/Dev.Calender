export type EventPriority = 'casual' | 'important' | 'urgent';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: EventPriority;
  taggedPersons: string[];
  calendarType: 'work' | 'personal' | 'combined';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}