'use client';

import { useGetUsersQuery } from '@/lib/features/user/userApi';
import { useAddMemberMutation, useRemoveMemberMutation } from '@/lib/features/projects/projectApi';
import { useToast } from '@/providers/ToastProvider';
import { UserPlus, UserMinus, Search } from 'lucide-react';
import { useState } from 'react';

export const ManageMembersForm = ({ 
  projectId, 
  currentMembers 
}: { 
  projectId: string; 
  currentMembers: any[] 
}) => {
  const { data: usersData, isLoading } = useGetUsersQuery(undefined);
  const [addMember] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  if (isLoading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>)}
  </div>;

  const users = usersData?.data || [];
  const currentMemberIds = currentMembers.map(m => m._id);

  const filteredUsers = users.filter((u: any) => 
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    !currentMemberIds.includes(u._id)
  );

  const handleAdd = async (userId: string) => {
    try {
      await addMember({ projectId, userId }).unwrap();
      showToast('Member added', 'success');
    } catch (error: any) {
      showToast(error.data?.message || 'Failed to add member', 'error');
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMember({ projectId, userId }).unwrap();
      showToast('Member removed', 'success');
    } catch (error: any) {
      showToast(error.data?.message || 'Failed to remove member', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Members</h3>
        <div className="space-y-2">
          {currentMembers.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{member.name}</p>
                  <p className="text-[10px] text-slate-500">{member.email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemove(member._id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <UserMinus size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Users</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-4">No other users found.</p>
          ) : (
            filteredUsers.map((user: any) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleAdd(user._id)}
                  className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                >
                  <UserPlus size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
