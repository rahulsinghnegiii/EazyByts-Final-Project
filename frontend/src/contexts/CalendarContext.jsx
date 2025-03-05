import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage on mount
  useEffect(() => {
    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem('calendar_events');
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        }
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('calendar_events', JSON.stringify(events));
    }
  }, [events, loading]);

  const addEvent = (eventData) => {
    try {
      // Validate the event data
      if (!eventData.title) {
        throw new Error('Event title is required');
      }

      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      // Create new event with unique ID
      const newEvent = {
        ...eventData,
        id: eventData.id || `event-${Date.now()}`,
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      };

      setEvents(prevEvents => [...prevEvents, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = (eventId, updatedData) => {
    try {
      if (!eventId) {
        throw new Error('Event ID is required');
      }

      setEvents(prevEvents => {
        const eventIndex = prevEvents.findIndex(event => event.id === eventId);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }

        const updatedEvents = [...prevEvents];
        updatedEvents[eventIndex] = {
          ...prevEvents[eventIndex],
          ...updatedData,
          updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        };

        return updatedEvents;
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = (eventId) => {
    try {
      if (!eventId) {
        throw new Error('Event ID is required');
      }

      setEvents(prevEvents => {
        const eventIndex = prevEvents.findIndex(event => event.id === eventId);
        if (eventIndex === -1) {
          throw new Error('Event not found');
        }

        const updatedEvents = [...prevEvents];
        updatedEvents.splice(eventIndex, 1);
        return updatedEvents;
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  const getEventsByDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const value = {
    currentDate,
    setCurrentDate,
    view,
    setView,
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDate,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}; 