'use client';

import { useGetProjectsQuery, useDeleteProjectMutation } from '@/lib/features/projects/projectApi';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Users, 
  Calendar, 
  Trash2, 
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/UI';
import Link from 'next/link';
import { useState } from 'react';
import { Modal } from '../common/Modal';
import { CreateProjectForm } from '../forms/CreateProjectForm';
import { useToast } from '@/providers/ToastProvider';

export const ProjectList = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetProjectsQuery({ page: 1, limit: 10 });
  const [deleteProject] = useDeleteProjectMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      try {
        await deleteProject(id).unwrap();
        showToast('Project deleted successfully', 'success');
      } catch (error: any) {
        showToast(error.data?.message || 'Failed to delete project', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
        ))}
      </div>
    );
  }

  const projects = data?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Active Projects</h2>
        {user?.role === 'admin' && (
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" /> New Project
          </Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <CreateProjectForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Plus size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold">No projects yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Start by creating your first project to organize your team&apos;s work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div 
              key={project._id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all flex flex-col group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl text-indigo-600">
                  <Plus size={24} />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {user?._id === project.createdBy?._id && (
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <Link href={`/projects/${project._id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">{project.description}</p>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div className="flex items-center text-xs text-slate-400 font-medium">
                  <Users size={14} className="mr-1.5" />
                  {project.members?.length || 0} Members
                </div>
                <div className="flex items-center text-xs text-slate-400 font-medium">
                  <Calendar size={14} className="mr-1.5" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
