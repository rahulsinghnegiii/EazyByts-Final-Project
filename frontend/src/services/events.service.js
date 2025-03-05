import api from './api';

class EventsService {
  // Event CRUD operations
  async getEvents(params) {
    return api.get('/events', { params });
  }

  async getEvent(id) {
    return api.get(`/events/${id}`);
  }

  async createEvent(eventData) {
    return api.post('/events', eventData);
  }

  async updateEvent(id, eventData) {
    return api.put(`/events/${id}`, eventData);
  }

  async deleteEvent(id) {
    return api.delete(`/events/${id}`);
  }

  // Categories
  async getCategories() {
    return api.get('/events/categories');
  }

  // Popular and upcoming events
  async getPopularEvents() {
    return api.get('/events/popular');
  }

  async getUpcomingEvents() {
    return api.get('/events/upcoming');
  }

  // Event registration and tickets
  async registerForEvent(eventId, ticketData) {
    return api.post(`/events/${eventId}/register`, ticketData);
  }

  async getEventRegistrations(eventId) {
    return api.get(`/events/${eventId}/registrations`);
  }

  async getUserRegistrations() {
    return api.get('/events/my-registrations');
  }

  // Event search and filters
  async searchEvents(query) {
    return api.get('/events/search', { params: { q: query } });
  }

  async getEventsByCategory(categoryId) {
    return api.get('/events', { params: { category: categoryId } });
  }

  // Event comments and ratings
  async addComment(eventId, comment) {
    return api.post(`/events/${eventId}/comments`, comment);
  }

  async getComments(eventId) {
    return api.get(`/events/${eventId}/comments`);
  }

  async rateEvent(eventId, rating) {
    return api.post(`/events/${eventId}/ratings`, { rating });
  }

  async getEventRatings(eventId) {
    return api.get(`/events/${eventId}/ratings`);
  }

  async getUserEvents() {
    return api.get('/events/my-events');
  }

  async getEventTickets(eventId) {
    return api.get(`/events/${eventId}/tickets`);
  }

  async bookTicket(eventId, ticketData) {
    return api.post(`/events/${eventId}/book`, ticketData);
  }

  async getUserTickets() {
    return api.get('/events/my-tickets');
  }

  async cancelTicket(ticketId) {
    return api.delete(`/tickets/${ticketId}`);
  }
}

export default new EventsService();