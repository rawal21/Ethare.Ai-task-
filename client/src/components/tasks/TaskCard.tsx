'use client';

import { useUpdateTaskStatusMutation, useDeleteTaskMutation } from '@/lib/features/tasks/taskApi';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  task: any;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { user } = useAuth();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusColors = {
    TODO: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20',
    DONE: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
  };

  const statusIcons = {
    TODO: <Clock size={14} />,
    IN_PROGRESS: <Clock size={14} className="animate-pulse" />,
    DONE: <CheckCircle2 size={14} />,
  };

  const canUpdateStatus = user?.role === 'admin' || user?._id === task.assignedTo?._id;
  const canDelete = user?.role === 'admin' && user?._id === task.projectId?.createdBy;

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus({ id: task._id, status: newStatus });
    setShowStatusMenu(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="relative">
          <button
            onClick={() => canUpdateStatus && setShowStatusMenu(!showStatusMenu)}
            disabled={!canUpdateStatus || isUpdating}
            className={`
              flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-bold transition-all
              ${statusColors[task.status as keyof typeof statusColors]}
              ${canUpdateStatus ? 'hover:brightness-95 cursor-pointer' : 'cursor-default'}
            `}
          >
            {statusIcons[task.status as keyof typeof statusIcons]}
            <span className="uppercase">{task.status.replace('_', ' ')}</span>
            {canUpdateStatus && <ChevronDown size={12} />}
          </button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-10 overflow-hidden py-1">
              {['TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {canDelete && (
          <button 
            onClick={() => deleteTask(task._id)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {task.projectId?.title && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">
          {task.projectId.title}
        </p>
      )}
      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{task.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
            {task.assignedTo?.name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-500">{task.assignedTo?.name}</span>
        </div>
        
        {task.deadline && (
          <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${
            new Date(task.deadline) < new Date() && task.status !== 'DONE'
              ? 'bg-red-50 text-red-500 dark:bg-red-900/20'
              : 'text-slate-400'
          }`}>
            <Clock size={12} className="mr-1" />
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
