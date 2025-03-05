import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, type EventFilters } from '../services/events.service';
import type { Event } from '../types/events.types';
import toast from 'react-hot-toast';

export const useEvents = (filters: EventFilters = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
  });

  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: (newEvent) => {
      queryClient.setQueryData<{ events: Event[] }>(['events', filters], (old) => {
        if (!old) return { events: [newEvent], total: 1, page: 1, totalPages: 1 };
        return {
          ...old,
          events: [newEvent, ...old.events],
          total: old.total + 1,
        };
      });
      toast.success('Event created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      eventService.updateEvent({ id, ...data }),
    onSuccess: (updatedEvent) => {
      queryClient.setQueryData<{ events: Event[] }>(['events', filters], (old) => {
        if (!old) return { events: [], total: 0, page: 1, totalPages: 1 };
        return {
          ...old,
          events: old.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        };
      });
      toast.success('Event updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: (_, id) => {
      queryClient.setQueryData<{ events: Event[] }>(['events', filters], (old) => {
        if (!old) return { events: [], total: 0, page: 1, totalPages: 1 };
        return {
          ...old,
          events: old.events.filter((event) => event.id !== id),
          total: old.total - 1,
        };
      });
      toast.success('Event deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  return {
    events: data?.events || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  };
};

export const useEvent = (id: string) => {
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
  });

  return {
    event,
    isLoading,
    error,
  };
};

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: eventService.getCategories,
  });

  return {
    categories,
    isLoading,
    error,
  };
};

export const usePopularEvents = (limit: number = 6) => {
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popularEvents', limit],
    queryFn: () => eventService.getPopularEvents(limit),
  });

  return {
    events,
    isLoading,
    error,
  };
};

export const useUpcomingEvents = (limit: number = 6) => {
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['upcomingEvents', limit],
    queryFn: () => eventService.getUpcomingEvents(limit),
  });

  return {
    events,
    isLoading,
    error,
  };
}; 