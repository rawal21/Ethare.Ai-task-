'use client';

import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { logout, setCredentials, restoreAuth } from '../lib/features/auth/authSlice';
import { useLoginMutation, useRegisterMutation } from '../lib/features/auth/authApi';
import { api } from '../lib/api';
import { useEffect } from 'react';
import { RootState } from '../lib/store';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, refreshToken, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  const login = async (credentials: any) => {
    try {
      const result: any = await loginMutation(credentials).unwrap();
      const userData = result.data.user;
      const { accessToken, refreshToken } = result.data.tokens;
      dispatch(setCredentials({ user: userData, token: accessToken, refreshToken }));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Login failed' };
    }
  };

  const register = async (userData: any) => {
    try {
      const result: any = await registerMutation(userData).unwrap();
      if (result.data && result.data.tokens) {
        const userData = result.data.user;
        const { accessToken, refreshToken } = result.data.tokens;
        dispatch(setCredentials({ user: userData, token: accessToken, refreshToken }));
        return { success: true };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
  };

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
    isLoggingIn,
    isRegistering,
  };
};
