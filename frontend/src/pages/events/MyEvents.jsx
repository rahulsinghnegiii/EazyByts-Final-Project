import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { formatEventDate } from '../../utils/date.utils';
import eventsService from '../../services/events.service';
import toast from 'react-hot-toast';

export const MyEvents = () => {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => eventsService.getEvents({ created_by: 'me' }),
  });

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventsService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      // Refetch events
      queryClient.invalidateQueries(['my-events']);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">
            Manage your created events
          </p>
        </div>
        <Button as={Link} to="/events/create">
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              You haven't created any events yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first event
            </p>
            <Button as={Link} to="/events/create">
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id} hoverable={true}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">
                        <Link
                          to={`/events/${event.id}`}
                          className="hover:text-primary"
                        >
                          {event.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatEventDate(event.startDate, event.endDate)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.venue.name} • {event.venue.city}, {event.venue.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      as={Link}
                      to={`/events/${event.id}/edit`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 