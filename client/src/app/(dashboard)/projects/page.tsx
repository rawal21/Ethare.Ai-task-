'use client';

import { ProjectList } from '@/components/projects/ProjectList';
import { withRole } from '@/components/hoc/withRole';

const ProjectsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-500">Manage and track all your team projects in one place.</p>
      </div>
      
      <ProjectList />
    </div>
  );
};

export default withRole(ProjectsPage, ['admin', 'member']);
