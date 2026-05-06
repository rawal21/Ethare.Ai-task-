'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateTaskMutation } from '@/lib/features/tasks/taskApi';
import { Input, Button } from '../common/UI';
import { useToast } from '@/providers/ToastProvider';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  assignedTo: z.string().min(1, 'Please assign to a member'),
  deadline: z.string().min(1, 'Please set a deadline').refine(val => {
    const selectedDate = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Deadline cannot be in the past"
  }),
});

type TaskValues = z.infer<typeof taskSchema>;

export const CreateTaskForm = ({ 
  projectId, 
  members, 
  ownerId,
  onSuccess 
}: { 
  projectId: string; 
  members: any[]; 
  ownerId?: string;
  onSuccess: () => void 
}) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { showToast } = useToast();

  // Filter out the project owner and any admins from assignable members
  const assignableMembers = members.filter(m => 
    m._id !== ownerId && m.role !== 'admin'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskValues) => {
    try {
      await createTask({ ...data, projectId }).unwrap();
      showToast('Task created successfully', 'success');
      onSuccess();
    } catch (error: any) {
      showToast(error.data?.message || 'Failed to create task', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="e.g., Design homepage"
        error={errors.title?.message}
        {...register('title')}
      />
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition-all dark:bg-slate-900 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 ${errors.description ? 'border-red-500' : ''}`}
          rows={3}
          placeholder="Details about the task..."
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign To</label>
          <select
            className={`w-full h-10 rounded-lg border bg-white px-3 text-sm outline-none transition-all dark:bg-slate-900 border-slate-200 focus:border-indigo-500 dark:border-slate-800 ${errors.assignedTo ? 'border-red-500' : ''}`}
            {...register('assignedTo')}
          >
            <option value="">Select Member</option>
            {assignableMembers.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          {errors.assignedTo && <p className="text-xs text-red-500">{errors.assignedTo.message}</p>}
        </div>

        <Input
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Task
      </Button>
    </form>
  );
};
