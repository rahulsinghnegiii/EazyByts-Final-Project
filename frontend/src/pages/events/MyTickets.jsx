import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { formatEventDate } from '../../utils/date.utils';
import eventsService from '../../services/events.service';

export const MyTickets = () => {
  const {
    data: registrations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: () => eventsService.getUserRegistrations(),
  });

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">
          View your purchased tickets and registrations
        </p>
      </div>

      {registrations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              You haven't purchased any tickets yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Browse our events and find something you'll love
            </p>
            <Button as={Link} to="/events">
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {registrations.map((registration) => (
            <Card key={registration.id} hoverable={true}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {registration.event.imageUrl && (
                      <img
                        src={registration.event.imageUrl}
                        alt={registration.event.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">
                        <Link
                          to={`/events/${registration.event.id}`}
                          className="hover:text-primary"
                        >
                          {registration.event.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatEventDate(
                          registration.event.startDate,
                          registration.event.endDate
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {registration.event.venue.name} •{' '}
                        {registration.event.venue.city},{' '}
                        {registration.event.venue.state}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {registration.ticketType.name}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          Ticket #{registration.ticketNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      as={Link}
                      to={`/tickets/${registration.id}`}
                      variant="outline"
                      size="sm"
                    >
                      View Ticket
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