import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  set,
  subWeeks,
  addWeeks,
  subDays,
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  CalendarIcon,
  ViewColumnsIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';
import { useCalendar } from '../contexts/CalendarContext';

const ViewSelector = ({ view, onViewChange }) => {
  const views = [
    { id: 'month', label: 'Month', icon: CalendarIcon },
    { id: 'week', label: 'Week', icon: ViewColumnsIcon },
    { id: 'day', label: 'Day', icon: ClockIcon },
  ];

  return (
    <div className="flex bg-gray-700 rounded-lg p-1">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`
            flex items-center px-3 py-1.5 text-sm font-medium rounded-md
            ${view === id
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }
          `}
        >
          <Icon className="h-4 w-4 mr-1.5" />
          {label}
        </button>
      ))}
    </div>
  );
};

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, view, onViewChange, onAddEvent, setCurrentDate }) => {
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const handleAddEventClick = () => {
    const now = new Date();
    onAddEvent(format(now, "yyyy-MM-dd'T'HH:mm:ss"));
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-6">
        <h2 className="text-2xl font-bold text-white">
          {format(currentDate, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
        </h2>
        <ViewSelector view={view} onViewChange={onViewChange} />
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={handleTodayClick}
          className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Today
        </button>
        <button 
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
        <button 
          onClick={handleAddEventClick}
          className="flex items-center px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-2"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Event
        </button>
      </div>
    </div>
  );
};

const EventModal = ({ isOpen, onClose, event, onSave }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (event) {
        if (typeof event === 'string') {
          // If event is a date string, create a new event with that date
          const defaultDate = new Date(event);
          const endDateTime = new Date(defaultDate);
          endDateTime.setHours(endDateTime.getHours() + 1);

          setStartDate(format(defaultDate, "yyyy-MM-dd'T'HH:mm"));
          setEndDate(format(endDateTime, "yyyy-MM-dd'T'HH:mm"));
          setTitle('');
          setLocation('');
          setDescription('');
        } else {
          // If editing an existing event
          setTitle(event.title || '');
          setStartDate(format(parseISO(event.startDate), "yyyy-MM-dd'T'HH:mm"));
          setEndDate(format(parseISO(event.endDate), "yyyy-MM-dd'T'HH:mm"));
          setLocation(event.location || '');
          setDescription(event.description || '');
        }
      } else {
        // If creating a new event without a specific date
        const now = new Date();
        const endDateTime = new Date(now);
        endDateTime.setHours(endDateTime.getHours() + 1);

        setStartDate(format(now, "yyyy-MM-dd'T'HH:mm"));
        setEndDate(format(endDateTime, "yyyy-MM-dd'T'HH:mm"));
        setTitle('');
        setLocation('');
        setDescription('');
      }
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formattedStartDate = format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss");
      const formattedEndDate = format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss");

      onSave({
        id: event?.id,
        title: title.trim(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: location.trim(),
        description: description.trim(),
      });
    } catch (error) {
      toast.error('Invalid date format. Please check your dates.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {event?.id ? 'Edit Event' : 'Add Event'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Event Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className={`w-full rounded-lg border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full rounded-lg border ${
                  errors.endDate ? 'border-red-500' : 'border-gray-600'
                } bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Location
            </label>
            <div className="relative">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (optional)"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 pl-10 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {event?.id ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventPopover = ({ event, onEdit, onDelete }) => (
  <div 
    className="absolute z-10 w-72 rounded-lg bg-gray-800 shadow-lg border border-gray-700 p-4"
    data-popover
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-start">
      <h4 className="text-base font-medium text-white">{event.title}</h4>
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          className="text-gray-400 hover:text-white"
          title="Edit event"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this event?')) {
              onDelete(event.id);
            }
          }}
          className="text-gray-400 hover:text-red-500"
          title="Delete event"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div className="mt-2 space-y-2">
      <div className="flex items-center text-sm text-gray-400">
        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
        <span>
          {format(parseISO(event.startDate), 'MMM d, h:mm a')} -{' '}
          {format(parseISO(event.endDate), 'h:mm a')}
        </span>
      </div>
      {event.location && (
        <div className="flex items-center text-sm text-gray-400">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
          <span>{event.location}</span>
        </div>
      )}
      {event.description && (
        <p className="text-sm text-gray-400 mt-2">{event.description}</p>
      )}
    </div>
  </div>
);

const MonthView = ({ currentDate, events = [], onEventClick, onAddEvent }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { deleteEvent } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="grid grid-cols-7 border-b border-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold text-white bg-gray-900"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 h-[800px]">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border-b border-r border-gray-700 relative group ${
              !isSameMonth(day, currentDate)
                ? 'bg-gray-900 text-gray-500'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            } ${dayIdx % 7 === 6 ? 'border-r-0' : ''}`}
            onClick={() => {
              if (isSameMonth(day, currentDate)) {
                const now = new Date();
                const eventDate = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate(),
                  now.getHours(),
                  now.getMinutes()
                );
                onAddEvent(format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"));
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  isToday(day)
                    ? 'h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center'
                    : 'text-white'
                }`}
              >
                {format(day, 'd')}
              </span>
              {isSameMonth(day, currentDate) && (
                <button 
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const now = new Date();
                    const eventDate = new Date(
                      day.getFullYear(),
                      day.getMonth(),
                      day.getDate(),
                      now.getHours(),
                      now.getMinutes()
                    );
                    onAddEvent(format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"));
                  }}
                >
                  <PlusIcon className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            <div className="mt-1 space-y-1">
              {sortedEvents
                .filter((event) => {
                  const eventDate = parseISO(event.startDate);
                  return isSameDay(eventDate, day);
                })
                .map((event) => (
                  <div key={event.id} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(selectedEventId === event.id ? null : event.id);
                      }}
                      className="w-full px-2 py-1 text-xs rounded-md bg-blue-900 text-white hover:bg-blue-800 truncate font-medium text-left"
                    >
                      {format(parseISO(event.startDate), 'HH:mm')} {event.title}
                    </button>
                    {selectedEventId === event.id && (
                      <EventPopover
                        event={event}
                        onEdit={onEventClick}
                        onDelete={deleteEvent}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeekView = ({ currentDate, events = [], onEventClick, onAddEvent }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { deleteEvent } = useCalendar();

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForTimeSlot = (day, hour) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      return (
        isSameDay(eventDate, day) &&
        getHours(eventDate) === hour
      );
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-auto">
      <div className="grid grid-cols-8 border-b border-gray-700 sticky top-0 z-10 bg-gray-900">
        <div className="py-3 pl-4 text-sm font-semibold text-white">Time</div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="py-3 text-center"
          >
            <div className="text-sm font-semibold text-white">
              {format(day, 'EEE')}
            </div>
            <div className={`text-sm ${
              isToday(day) ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-700">
            <div className="py-4 pl-4 text-sm text-gray-400 border-r border-gray-700">
              {format(set(new Date(), { hours: hour }), 'ha')}
            </div>
            {days.map((day) => {
              const timeSlotEvents = getEventsForTimeSlot(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="relative p-1 border-r border-gray-700 min-h-[4rem]"
                  onClick={() => {
                    const eventDate = set(day, { hours: hour });
                    onAddEvent(format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"));
                  }}
                >
                  {timeSlotEvents.map((event) => (
                    <div key={event.id} className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventId(selectedEventId === event.id ? null : event.id);
                        }}
                        className="w-full px-2 py-1 text-xs rounded-md bg-blue-900 text-white hover:bg-blue-800 truncate font-medium text-left mb-1"
                      >
                        {event.title}
                      </button>
                      {selectedEventId === event.id && (
                        <EventPopover
                          event={event}
                          onEdit={onEventClick}
                          onDelete={deleteEvent}
                        />
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DayView = ({ currentDate, events = [], onEventClick, onAddEvent }) => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { deleteEvent } = useCalendar();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      return (
        isSameDay(eventDate, currentDate) &&
        getHours(eventDate) === hour
      );
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-auto">
      <div className="grid grid-cols-1 border-b border-gray-700 sticky top-0 z-10 bg-gray-900">
        <div className="py-3 px-4 text-center">
          <div className="text-lg font-semibold text-white">
            {format(currentDate, 'EEEE')}
          </div>
          <div className={`text-sm ${
            isToday(currentDate) ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      <div className="relative">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div
              key={hour}
              className="grid grid-cols-[100px_1fr] border-b border-gray-700"
            >
              <div className="py-4 px-4 text-sm text-gray-400 border-r border-gray-700">
                {format(set(new Date(), { hours: hour }), 'ha')}
              </div>
              <div
                className="relative p-2 min-h-[5rem]"
                onClick={() => {
                  const eventDate = set(currentDate, { hours: hour });
                  onAddEvent(format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"));
                }}
              >
                {hourEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEventId(selectedEventId === event.id ? null : event.id);
                      }}
                      className="w-full px-3 py-2 mb-2 text-sm rounded-md bg-blue-900 text-white hover:bg-blue-800 font-medium text-left"
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs text-gray-300">
                        {format(parseISO(event.startDate), 'h:mm a')} - 
                        {format(parseISO(event.endDate), 'h:mm a')}
                        {event.location && ` • ${event.location}`}
                      </div>
                    </button>
                    {selectedEventId === event.id && (
                      <EventPopover
                        event={event}
                        onEdit={onEventClick}
                        onDelete={deleteEvent}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Calendar = () => {
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendar();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close event popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const popovers = document.querySelectorAll('[data-popover]');
      if (popovers.length > 0) {
        popovers.forEach(popover => {
          if (!popover.contains(e.target)) {
            setSelectedEvent(null);
          }
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handlePrevPeriod = () => {
    switch (view) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (view) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleAddEvent = (defaultDate) => {
    try {
      let eventDate = defaultDate ? new Date(defaultDate) : new Date();
      
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date');
      }

      // Create end date 1 hour after start date
      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + 1);

      setSelectedEvent({
        startDate: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Invalid date format. Please try again.');
    }
  };

  const handleEditEvent = (event) => {
    try {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date');
      }
      setSelectedEvent(event);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Invalid event date format. Please try again.');
    }
  };

  const handleSaveEvent = (eventData) => {
    try {
      // Validate dates
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      // Generate a unique ID for new events
      const newEventData = {
        ...eventData,
        id: eventData.id || `event-${Date.now()}`,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
      };

      if (selectedEvent?.id) {
        updateEvent(selectedEvent.id, newEventData);
        toast.success('Event updated successfully');
      } else {
        addEvent(newEventData);
        toast.success('Event created successfully');
      }
      
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save event. Please try again.');
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 p-6 rounded-lg">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevPeriod}
        onNextMonth={handleNextPeriod}
        view={view}
        onViewChange={setView}
        onAddEvent={handleAddEvent}
        setCurrentDate={setCurrentDate}
      />

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEditEvent}
          onAddEvent={handleAddEvent}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEditEvent}
          onAddEvent={handleAddEvent}
        />
      )}
      {view === 'day' && (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEditEvent}
          onAddEvent={handleAddEvent}
        />
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
}; 