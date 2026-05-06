'use client';

import { TaskList } from '@/components/tasks/TaskList';
import { withRole } from '@/components/hoc/withRole';
import { Button } from '@/components/common/UI';
import { Plus, ListTodo } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { useGetProjectsQuery } from '@/lib/features/projects/projectApi';
import { CreateTaskForm } from '@/components/forms/CreateTaskForm';

const TasksPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projectsData } = useGetProjectsQuery({ limit: 100 });
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const projects = projectsData?.data?.data || [];
  const selectedProject = projects.find((p: any) => p._id === selectedProjectId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-slate-500">Manage and track your workload across all projects.</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> New Task
          </Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Project</label>
            <select
              className="w-full h-10 rounded-lg border bg-white px-3 text-sm outline-none transition-all dark:bg-slate-900 border-slate-200 focus:border-indigo-500 dark:border-slate-800"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Choose a project...</option>
              {projects.map((p: any) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          {selectedProjectId && (
            <CreateTaskForm 
              projectId={selectedProjectId} 
              members={selectedProject?.members || []} 
              onSuccess={() => setIsModalOpen(false)} 
            />
          )}
        </div>
      </Modal>
      
      <TaskList />
    </div>
  );
};

export default withRole(TasksPage, ['admin', 'member']);
