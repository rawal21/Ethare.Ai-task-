'use client';

import { useGetDashboardStatsQuery } from '@/lib/features/dashboard/dashboardApi';
import { useGetTasksQuery } from '@/lib/features/tasks/taskApi';
import { useAuth } from '@/hooks/useAuth';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  ArrowRight, 
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { withRole } from '@/components/hoc/withRole';
import { TaskCard } from '@/components/tasks/TaskCard';
import Link from 'next/link';

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery(undefined);
  const { data: myTasksData, isLoading: tasksLoading } = useGetTasksQuery({ 
    assignedTo: user?._id, 
    limit: 3,
    status: 'TODO' 
  });
  
  if (statsLoading || tasksLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = statsData?.data || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    myTasksCount: 0
  };

  const myTasks = myTasksData?.data?.data || [];

  const cards = [
    { name: 'Total Tasks', value: stats.totalTasks, icon: ListTodo, color: 'bg-indigo-500' },
    { name: 'Completed', value: stats.completedTasks, icon: CheckCircle2, color: 'bg-emerald-500' },
    { name: 'Pending', value: stats.pendingTasks, icon: Clock, color: 'bg-amber-500' },
    { name: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-slate-500">Here&apos;s an overview of your team&apos;s performance.</p>
        </div>
        <Link href="/tasks">
          <Button>
            View All Tasks <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-2.5 rounded-xl text-white shadow-lg shadow-current/10`}>
                <card.icon size={22} />
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1" />
                +12%
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.name}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Tasks Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">My Priority Tasks</h2>
            <Link href="/tasks" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500">You have no pending tasks assigned to you.</p>
              </div>
            ) : (
              myTasks.map((task: any) => (
                <TaskCard key={task._id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Team Momentum</h2>
          <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckSquare size={120} />
            </div>
            <div className="z-10">
              <h2 className="text-2xl font-bold mb-2">Goal Progress</h2>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Your team has completed {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% of total tasks. 
                {stats.overdueTasks > 0 ? ` Watch out for those ${stats.overdueTasks} overdue items!` : " You're on track!"}
              </p>
            </div>
            <div className="z-10">
              <div className="flex items-center justify-between mb-3 text-sm font-bold">
                <span>Monthly Target</span>
                <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-indigo-500/50 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%` }}
                ></div>
              </div>
              <Button variant="outline" className="w-full mt-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(DashboardPage, ['admin', 'member']);
