'use client';

import { Settings, Construction, Bell, Palette, Shield, Globe } from 'lucide-react';
import { withRole } from '@/components/hoc/withRole';

const SettingsPage = () => {
  const settingsGroups = [
    { name: 'Notifications', description: 'Configure email and push notification preferences', icon: Bell },
    { name: 'Appearance', description: 'Theme, language, and display settings', icon: Palette },
    { name: 'Security', description: 'Password, two-factor authentication, sessions', icon: Shield },
    { name: 'Integrations', description: 'Connect third-party services and webhooks', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and application preferences.</p>
      </div>

      {/* In Progress Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-start space-x-4">
        <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl flex-shrink-0">
          <Construction className="text-amber-600" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-amber-800 dark:text-amber-200">Under Development</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Settings functionality is currently being built. Check back soon for full configuration options.
          </p>
        </div>
      </div>

      {/* Settings Grid (Disabled) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsGroups.map((group) => (
          <div
            key={group.name}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <group.icon className="text-slate-400" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{group.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{group.description}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withRole(SettingsPage, ['admin', 'member']);
