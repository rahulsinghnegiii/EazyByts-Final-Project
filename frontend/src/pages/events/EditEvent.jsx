import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../../utils/validation.utils';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';
import toast from 'react-hot-toast';

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        // TODO: Implement actual API call
        const mockEvent = {
          title: 'Sample Event',
          description: 'This is a sample event description.',
          startDate: '2024-03-20T10:00',
          endDate: '2024-03-20T18:00',
          venue: {
            name: 'Sample Venue',
            address: '123 Main St',
            city: 'Sample City',
            state: 'ST',
            zipCode: '12345',
          },
          ticketTypes: [
            {
              name: 'General Admission',
              description: 'Standard ticket',
              price: 50,
              quantity: 100,
            },
          ],
          category: {
            id: '1',
            name: 'Conference',
          },
        };
        reset(mockEvent);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      // TODO: Implement actual API call
      console.log('Updated event data:', data);
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-sm text-muted-foreground">
            Update your event details below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Event Title"
                {...register('title')}
                error={errors.title?.message}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full min-h-[100px] rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your event..."
                />
                {errors.description?.message && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Start Date & Time"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />
                <Input
                  type="datetime-local"
                  label="End Date & Time"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Venue Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Venue Name"
                    {...register('venue.name')}
                    error={errors.venue?.name?.message}
                  />
                  <Input
                    label="Address"
                    {...register('venue.address')}
                    error={errors.venue?.address?.message}
                  />
                  <Input
                    label="City"
                    {...register('venue.city')}
                    error={errors.venue?.city?.message}
                  />
                  <Input
                    label="State"
                    {...register('venue.state')}
                    error={errors.venue?.state?.message}
                  />
                  <Input
                    label="ZIP Code"
                    {...register('venue.zipCode')}
                    error={errors.venue?.zipCode?.message}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/events/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Update Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 