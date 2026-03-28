/**
 * Login page — email + password authentication form.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { post } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AuthResponse, ApiError } from '@/types';
import type { LoginFormValues } from '@/types';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) =>
      post<AuthResponse>('/api/v1/auth/login', data),
    onSuccess: (data) => {
      login(data.access_token, data.shop);
      navigate('/dashboard', { replace: true });
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { data?: ApiError } };
      const message =
        apiErr?.response?.data?.error?.message ?? 'Login failed. Please try again.';
      toast.error(message);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp-500 text-white text-xl font-bold shadow-lg">
            WA
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your WhatsApp Order Manager
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" fullWidth loading={mutation.isPending}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
