/**
 * Registration page — create a new shop account.
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
import type { AuthResponse, ApiError, RegisterFormValues } from '@/types';

const schema = z
  .object({
    name: z.string().min(2, 'Shop name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone_number: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ confirmPassword: _cp, ...data }: RegisterFormValues) =>
      post<AuthResponse>('/api/v1/auth/register', data),
    onSuccess: (data) => {
      login(data.access_token, data.shop);
      toast.success('Account created! Welcome.');
      navigate('/dashboard', { replace: true });
    },
    onError: (err: unknown) => {
      const apiErr = err as { response?: { data?: ApiError } };
      const message =
        apiErr?.response?.data?.error?.message ?? 'Registration failed.';
      toast.error(message);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-whatsapp-500 text-white text-xl font-bold shadow-lg">
            WA
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Set up your WhatsApp Order Manager</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="space-y-5"
          >
            <Input
              label="Shop / Business name"
              placeholder="My Awesome Shop"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="WhatsApp phone number"
              type="tel"
              placeholder="+919876543210"
              helperText="The WhatsApp number linked to your Meta Business account"
              error={errors.phone_number?.message}
              {...register('phone_number')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={mutation.isPending}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
