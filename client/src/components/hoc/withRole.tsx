'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: ('admin' | 'member')[]
) => {
  return function ProtectedComponent(props: P) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Small delay to allow restoreAuth to run
      const checkAuth = () => {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (user && !allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
        }
      };

      const timeout = setTimeout(checkAuth, 100);
      return () => clearTimeout(timeout);
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
