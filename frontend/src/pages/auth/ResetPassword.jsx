import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { resetPasswordSchema } from '../../utils/validation.utils';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
  } = useForm({
    schema: resetPasswordSchema,
  });

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword({ token, password: data.password });
      toast.success('Password has been reset successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Invalid Reset Link</h2>
          <p className="mt-2 text-muted-foreground">
            The password reset link is invalid or has expired.
          </p>
          <Button onClick={() => navigate('/auth/forgot-password')} className="mt-4">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Reset Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}; 