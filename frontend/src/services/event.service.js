import api from './api';

export const eventService = {
  async createEvent(eventData) {
    try {
      // If eventData contains a file, use FormData
      if (eventData instanceof FormData) {
        return await api.post('/events', eventData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return await api.post('/events', eventData);
    } catch (error) {
      console.error('Create event error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async getEvents(params = {}) {
    try {
      return await api.get('/events', { params });
    } catch (error) {
      console.error('Get events error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  async getEventById(id) {
    try {
      return await api.get(`/events/${id}`);
    } catch (error) {
      console.error('Get event error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  },

  async updateEvent(id, eventData) {
    try {
      // If eventData contains a file, use FormData
      if (eventData instanceof FormData) {
        return await api.put(`/events/${id}`, eventData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      return await api.put(`/events/${id}`, eventData);
    } catch (error) {
      console.error('Update event error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  async deleteEvent(id) {
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error('Delete event error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },
}; 