'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProjectMutation } from '@/lib/features/projects/projectApi';
import { Input, Button } from '../common/UI';
import { useToast } from '@/providers/ToastProvider';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ProjectValues = z.infer<typeof projectSchema>;

export const CreateProjectForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectValues) => {
    try {
      await createProject(data).unwrap();
      showToast('Project created successfully', 'success');
      onSuccess();
    } catch (error: any) {
      showToast(error.data?.message || 'Failed to create project', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Title"
        placeholder="e.g., Q2 Marketing Campaign"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          className={`w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none transition-all dark:bg-slate-900 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 ${errors.description ? 'border-red-500' : ''}`}
          rows={4}
          placeholder="What is this project about?"
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Project
      </Button>
    </form>
  );
};
