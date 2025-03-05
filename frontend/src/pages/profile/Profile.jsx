import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../utils/validation.utils';
import { Input } from '../../components/common/Input';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="max-w-2xl">
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                
                <Input
                  label="Current Password"
                  type="password"
                  {...register('currentPassword')}
                  error={errors.currentPassword?.message}
                />

                <Input
                  label="New Password"
                  type="password"
                  {...register('newPassword')}
                  error={errors.newPassword?.message}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  {...register('confirmNewPassword')}
                  error={errors.confirmNewPassword?.message}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}; 