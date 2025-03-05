import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const isOrganizer = event?.organizer._id === userId;
  const isRegistered = event?.attendees.some(attendee => attendee._id === userId);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const data = await eventService.getEventById(id);
          setEvent(data);
        }
      } catch (error) {
        toast.error('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsRegistering(true);
      if (id) {
        await eventService.registerForEvent(id);
        toast.success('Successfully registered for event');
        // Refresh event data
        const updatedEvent = await eventService.getEventById(id);
        setEvent(updatedEvent);
      }
    } catch (error) {
      toast.error('Failed to register for event');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setIsRegistering(true);
      if (id) {
        await eventService.cancelRegistration(id);
        toast.success('Successfully cancelled registration');
        // Refresh event data
        const updatedEvent = await eventService.getEventById(id);
        setEvent(updatedEvent);
      }
    } catch (error) {
      toast.error('Failed to cancel registration');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ${event.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {event.capacity - event.attendees.length} spots left
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 my-6">
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Date</h3>
              <p className="text-gray-900">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Location</h3>
              <p className="text-gray-900">{event.location}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Category</h3>
              <p className="text-gray-900">{event.category}</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">Organizer</h3>
              <p className="text-gray-900">{event.organizer.name}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {isOrganizer ? (
              <>
                <Button
                  onClick={() => navigate(`/events/${event._id}/edit`)}
                  variant="secondary"
                >
                  Edit Event
                </Button>
                <Button
                  onClick={() => navigate(`/events/${event._id}/manage`)}
                  variant="primary"
                >
                  Manage Event
                </Button>
              </>
            ) : (
              <>
                {isRegistered ? (
                  <Button
                    onClick={handleCancelRegistration}
                    variant="danger"
                    disabled={isRegistering}
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={
                      isRegistering ||
                      event.status !== 'published' ||
                      event.attendees.length >= event.capacity
                    }
                  >
                    {isRegistering
                      ? 'Registering...'
                      : event.status !== 'published'
                      ? 'Event Not Available'
                      : event.attendees.length >= event.capacity
                      ? 'Event Full'
                      : 'Register Now'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  // Define prop types if needed
}; 