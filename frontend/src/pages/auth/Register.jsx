import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validation.utils';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-4xl font-bold text-blue-600">
            EventXpert
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full name"
                {...register('name')}
                error={errors.name?.message}
                autoComplete="name"
                required
              />

              <Input
                label="Email address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                required
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
                required
                helperText="Must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
              />

              <Input
                label="Confirm password"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                required
              />

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('terms')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="terms"
                    className={`text-sm ${
                      errors.terms ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.terms.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => handleSocialLogin('google')}
                >
                  <FaGoogle className="w-5 h-5 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => handleSocialLogin('github')}
                >
                  <FaGithub className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}; 