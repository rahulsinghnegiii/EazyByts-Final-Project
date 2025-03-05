import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { profileSchema } from '../utils/validation.utils';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
  } = useForm({
    schema: profileSchema,
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal information.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full name"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Button type="submit" isLoading={isSubmitting}>
              Save changes
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}; 