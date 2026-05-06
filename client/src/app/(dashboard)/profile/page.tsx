'use client';

import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { withRole } from '@/components/hoc/withRole';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
            {user?.name.charAt(0)}
          </div>
        </div>
        <div className="pt-16 p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center space-x-3">
              <Shield className="text-indigo-500" size={20} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Role</p>
                <p className="text-sm font-bold capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center space-x-3">
              <Calendar className="text-indigo-500" size={20} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Joined</p>
                <p className="text-sm font-bold">May 2026</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={logout} className="text-red-500 border-red-100 hover:bg-red-50">
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
            <Button disabled>Edit Profile</Button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-6 flex items-start space-x-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600">
          <Shield size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">Account Security</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
            Your account is currently using password-based authentication. Enable Two-Factor Authentication for better security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRole(ProfilePage, ['admin', 'member']);
