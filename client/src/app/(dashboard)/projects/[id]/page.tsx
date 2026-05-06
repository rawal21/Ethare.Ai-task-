'use client';

import { useParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/lib/features/projects/projectApi';
import { useGetTasksQuery } from '@/lib/features/tasks/taskApi';
import { 
  Users, 
  Calendar, 
  Plus, 
  UserPlus, 
  ChevronRight,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { withRole } from '@/components/hoc/withRole';
import { useAuth } from '@/hooks/useAuth';
import { ManageMembersForm } from '@/components/forms/ManageMembersForm';
import { CreateTaskForm } from '@/components/forms/CreateTaskForm';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: projectResponse, isLoading: projectLoading, error: projectError } = useGetProjectByIdQuery(id as string);
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({ projectId: id, limit: 100 });
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  if (projectLoading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-lg"></div>
      <div className="h-48 bg-white dark:bg-slate-900 rounded-3xl"></div>
    </div>
  );

  if (projectError) {
    const status = (projectError as any)?.status;
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
          <Users size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {status === 403 ? "Access Denied" : "Project Not Found"}
        </h1>
        <p className="text-slate-500 text-center max-w-md">
          {status === 403 
            ? "You do not have permission to view this project. Please contact the project administrator if you believe this is an error."
            : "The project you are looking for does not exist or has been deleted."}
        </p>
        <Button onClick={() => window.location.href = '/projects'}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const project = projectResponse?.data;
  const tasks = tasksData?.data?.data || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500">
        <LayoutDashboard size={16} />
        <ChevronRight size={14} />
        <Link href="/projects" className="hover:text-indigo-600">Projects</Link>
        <ChevronRight size={14} />
        <span className="font-bold text-slate-900 dark:text-slate-100">{project?.title}</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{project?.title}</h1>
          <p className="text-lg text-slate-500 max-w-2xl">{project?.description}</p>
          
          <div className="flex items-center space-x-6 pt-2">
            <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400">
              <Calendar size={18} className="mr-2 text-indigo-500" />
              Created {new Date(project?.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400">
              <Users size={18} className="mr-2 text-indigo-500" />
              {project?.members?.length || 0} Members
            </div>
          </div>
        </div>

        <div className="lg:w-72 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Project Owner</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                {project?.createdBy?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-bold">{project?.createdBy?.name}</p>
                <p className="text-xs text-slate-500">{project?.createdBy?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tasks List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              Project Tasks
              <span className="ml-3 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full">{tasks.length}</span>
            </h2>
            {user?.role === 'admin' && (
              <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
                <Plus size={16} className="mr-2" /> New Task
              </Button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
              <Clock size={48} className="mx-auto mb-4 text-slate-300 opacity-20" />
              <h3 className="text-lg font-bold text-slate-400">No tasks in this project yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task: any) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Members List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Team</h2>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsMemberModalOpen(true)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
              >
                <UserPlus size={20} />
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {project?.members?.map((member: any) => (
                <div key={member._id} className="p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  </div>
                  <div className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-md font-bold text-slate-400 uppercase">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} title="Manage Project Team">
        <ManageMembersForm projectId={id as string} currentMembers={project?.members || []} />
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create Project Task">
        <CreateTaskForm 
          projectId={id as string} 
          members={project?.members || []} 
          ownerId={project?.createdBy?._id}
          onSuccess={() => setIsTaskModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

// Need to import Link
import Link from 'next/link';

export default withRole(ProjectDetailsPage, ['admin', 'member']);
