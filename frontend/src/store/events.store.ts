import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { eventService, type EventFilters } from '../services/events.service';
import type { Event, Category } from '../types/events.types';

interface EventsState {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  categories: Category[];
  selectedEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  getEvents: (filters?: EventFilters) => Promise<void>;
  getEvent: (id: string) => Promise<void>;
  getCategories: () => Promise<void>;
  createEvent: (data: FormData) => Promise<Event>;
  updateEvent: (id: string, data: FormData) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  setFilters: (filters: EventFilters) => void;
  clearFilters: () => void;
  clearSelectedEvent: () => void;
  clearError: () => void;
}

export const useEventsStore = create<EventsState>()(
  devtools(
    (set, get) => ({
      events: [],
      total: 0,
      page: 1,
      totalPages: 1,
      categories: [],
      selectedEvent: null,
      filters: {},
      isLoading: false,
      error: null,

      getEvents: async (filters = {}) => {
        try {
          set({ isLoading: true, error: null });
          const response = await eventService.getEvents({ ...get().filters, ...filters });
          set({
            events: response.events,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
            filters: { ...get().filters, ...filters },
          });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      getEvent: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const event = await eventService.getEvent(id);
          set({ selectedEvent: event });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      getCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await eventService.getCategories();
          set({ categories });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      createEvent: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const event = await eventService.createEvent(data);
          set((state) => ({
            events: [event, ...state.events],
            total: state.total + 1,
          }));
          return event;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateEvent: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const updatedEvent = await eventService.updateEvent({ id, ...data });
          set((state) => ({
            events: state.events.map((event) =>
              event.id === id ? updatedEvent : event
            ),
            selectedEvent: updatedEvent,
          }));
          return updatedEvent;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteEvent: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await eventService.deleteEvent(id);
          set((state) => ({
            events: state.events.filter((event) => event.id !== id),
            total: state.total - 1,
            selectedEvent: null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      clearSelectedEvent: () => {
        set({ selectedEvent: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'events-store',
    }
  )
); 