'use client';

import { useGetTasksQuery } from '@/lib/features/tasks/taskApi';
import { TaskCard } from './TaskCard';
import { Button } from '../common/UI';
import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const TaskList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetTasksQuery({ 
    page, 
    limit: 12, 
    search: debouncedSearch,
    status: status || undefined
  });

  const tasks = data?.data?.data || [];
  const meta = data?.data?.meta || { totalPages: 1 };

  const clearFilters = () => {
    setStatus('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks by title..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            {['', 'TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`
                  px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                  ${status === s 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
              >
                {s === '' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {(search || status) && (
            <button 
              onClick={clearFilters}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear all filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"></div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No tasks found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          <Button variant="outline" size="sm" className="mt-6" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-sm font-bold px-4">Page {page} of {meta.totalPages}</span>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
