'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { Input, Button } from '../common/UI';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setError(null);
    const result = await login(data);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={Lock}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded border-slate-300" id="remember" />
          <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400">Remember me</label>
        </div>
        <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoggingIn}>
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-indigo-600 font-semibold hover:underline">Sign up</a>
      </p>
    </form>
  );
};
