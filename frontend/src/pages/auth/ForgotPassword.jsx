import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { forgotPasswordSchema } from '../../utils/validation.utils';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
  } = useForm({
    schema: forgotPasswordSchema,
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset instructions');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Send reset instructions
            </Button>

            <div className="text-center text-sm">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-primary hover:text-primary/90">
                Sign in
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}; 