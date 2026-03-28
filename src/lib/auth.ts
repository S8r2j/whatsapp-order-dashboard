/**
 * Authentication utilities.
 *
 * Thin helpers that sit on top of the auth store and the API client.
 * Import these in components instead of accessing the store directly
 * when you need to perform auth-related side effects.
 */

import { post } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { AuthResponse, LoginFormValues, RegisterFormValues } from '@/types';

/**
 * Log in with email and password.
 * Stores the token and shop profile in the Zustand auth store on success.
 *
 * @throws AxiosError with the API error envelope on failure.
 */
export async function loginUser(credentials: LoginFormValues): Promise<AuthResponse> {
  const data = await post<AuthResponse>('/api/v1/auth/login', credentials);
  useAuthStore.getState().login(data.access_token, data.shop);
  return data;
}

/**
 * Register a new shop account.
 * Stores the token and shop profile in the Zustand auth store on success.
 *
 * @throws AxiosError with the API error envelope on failure.
 */
export async function registerUser(
  payload: Omit<RegisterFormValues, 'confirmPassword'>
): Promise<AuthResponse> {
  const data = await post<AuthResponse>('/api/v1/auth/register', payload);
  useAuthStore.getState().login(data.access_token, data.shop);
  return data;
}

/**
 * Log out the current user — clears the auth store and redirects to /login.
 */
export function logoutUser(): void {
  useAuthStore.getState().logout();
  window.location.href = '/login';
}

/**
 * Return true if the current session token is present.
 * Does NOT verify the token with the server — use for UI gating only.
 */
export function isLoggedIn(): boolean {
  return useAuthStore.getState().isAuthenticated;
}
