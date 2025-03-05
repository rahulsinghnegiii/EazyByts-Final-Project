import api from './api';
import type { Event, Category, TicketType } from '../types/events.types';

export interface EventFilters {
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  venueId?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venueId: string;
  categoryId: string;
  ticketTypes: Omit<TicketType, 'id'>[];
  image?: File;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

class EventService {
  async getEvents(filters: EventFilters = {}): Promise<{
    events: Event[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get('/events', { params: filters });
    return response.data;
  }

  async getEvent(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'ticketTypes') {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateEvent(data: UpdateEventData): Promise<Event> {
    const { id, ...updateData } = data;
    const formData = new FormData();
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'ticketTypes') {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.patch(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  }

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/events/categories');
    return response.data;
  }

  async getMyEvents(): Promise<Event[]> {
    const response = await api.get('/events/my-events');
    return response.data;
  }

  async getPopularEvents(limit: number = 6): Promise<Event[]> {
    const response = await api.get('/events/popular', { params: { limit } });
    return response.data;
  }

  async getUpcomingEvents(limit: number = 6): Promise<Event[]> {
    const response = await api.get('/events/upcoming', { params: { limit } });
    return response.data;
  }

  async searchEvents(query: string): Promise<Event[]> {
    const response = await api.get('/events/search', { params: { q: query } });
    return response.data;
  }
}

export const eventService = new EventService();
export default eventService; 