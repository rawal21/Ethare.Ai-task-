'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Input, Button } from '../common/UI';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'member']),
});

type RegisterValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register: registerUser, isRegistering } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'member',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterValues) => {
    setError(null);
    const result = await registerUser(data);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-slate-500 text-sm">Join the team and start managing tasks</p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={User}
        error={errors.name?.message}
        {...register('name')}
      />

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

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
          <ShieldCheck size={16} className="mr-2 text-slate-400" />
          I am a...
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'member')}
            className={`
              px-4 py-2 text-sm rounded-lg border transition-all
              ${selectedRole === 'member' 
                ? 'bg-indigo-50 border-indigo-600 text-indigo-600 dark:bg-indigo-900/20' 
                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}
            `}
          >
            Team Member
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'admin')}
            className={`
              px-4 py-2 text-sm rounded-lg border transition-all
              ${selectedRole === 'admin' 
                ? 'bg-indigo-50 border-indigo-600 text-indigo-600 dark:bg-indigo-900/20' 
                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}
            `}
          >
            Admin
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isRegistering}>
        Get Started
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
        Already have an account?{' '}
        <a href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</a>
      </p>
    </form>
  );
};
