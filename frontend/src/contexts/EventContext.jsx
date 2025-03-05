import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { eventService } from '../services/event.service';
import toast from 'react-hot-toast';

const EventContext = createContext(null);

// Export the hook as a named function declaration for consistent HMR
export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

// Export the provider as a named function for consistent HMR
export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events with optional filters
  const fetchEvents = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents(filters);
      setEvents(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single event by ID
  const fetchEventById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEventById(id);
      setEvent(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new event
  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.createEvent(eventData);
      setEvents(prev => [...prev, data]);
      toast.success('Event created successfully!');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing event
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.updateEvent(id, eventData);
      setEvents(prev => prev.map(event => event.id === id ? data : event));
      setEvent(data);
      toast.success('Event updated successfully!');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search events
  const searchEvents = useCallback(async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents({ search: searchTerm });
      setEvents(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    events,
    event,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

EventProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 