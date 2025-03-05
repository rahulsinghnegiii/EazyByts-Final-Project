import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
});

export const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Update profile
      if (data.name !== user.name || data.email !== user.email) {
        await updateProfile({
          name: data.name,
          email: data.email,
        });
        toast.success('Profile updated successfully');
      }

      // Change password
      if (data.newPassword) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        toast.success('Password changed successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile information and password
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Leave the password fields empty if you don't want to change it
              </p>
              <Input
                label="Current password"
                type="password"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
              <Input
                label="New password"
                type="password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Input
                label="Confirm new password"
                type="password"
                {...register('confirmNewPassword')}
                error={errors.confirmNewPassword?.message}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // TODO: Implement account deletion
                toast.error('Account deletion not implemented yet');
              }
            }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 