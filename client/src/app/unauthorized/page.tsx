'use client';

import { Button } from '@/components/common/UI';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl mb-6">
        <ShieldAlert size={64} className="text-red-500" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-slate-500 max-w-md mb-8">
        You don&apos;t have the necessary permissions to view this page. This area is restricted to administrators only.
      </p>
      <Button onClick={() => router.push('/dashboard')}>
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </Button>
    </div>
  );
}
