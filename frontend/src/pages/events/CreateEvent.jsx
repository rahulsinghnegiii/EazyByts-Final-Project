import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaTicketAlt, FaImage } from 'react-icons/fa';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

// Validation schema
const createEventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(3, 'Venue must be at least 3 characters'),
  capacity: z.string().transform(Number).refine(val => val > 0, 'Capacity must be greater than 0'),
  price: z.string().transform(Number).refine(val => val >= 0, 'Price must be 0 or greater'),
  image: z.instanceof(FileList).refine(files => files.length > 0, 'Image is required')
    .transform(files => files[0])
    .refine(file => file.size <= 5000000, 'Max image size is 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png and .webp formats are supported'
    ),
});

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createEventSchema),
  });

  // Watch for image changes to show preview
  const imageFile = watch('image');
  React.useEffect(() => {
    if (imageFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const result = await response.json();
      toast.success('Event created successfully!');
      navigate(`/events/${result.id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Event
          </h1>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Input
                  label="Event Name"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Enter event name"
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter event description"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    {...register('date')}
                    error={errors.date?.message}
                    icon={<FaCalendar />}
                  />
                  <Input
                    label="Time"
                    type="time"
                    {...register('time')}
                    error={errors.time?.message}
                    icon={<FaClock />}
                  />
                </div>

                <Input
                  label="Venue"
                  {...register('venue')}
                  error={errors.venue?.message}
                  placeholder="Enter venue name"
                  icon={<FaMapMarkerAlt />}
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Capacity"
                    type="number"
                    {...register('capacity')}
                    error={errors.capacity?.message}
                    placeholder="0"
                    min="0"
                    icon={<FaTicketAlt />}
                  />
                  <Input
                    label="Price"
                    type="number"
                    {...register('price')}
                    error={errors.price?.message}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    icon={<span className="text-sm">$</span>}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Event Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-auto rounded"
                          />
                        </div>
                      ) : (
                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            {...register('image')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                  {errors.image && (
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}; 