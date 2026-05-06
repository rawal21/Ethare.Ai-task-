export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Illustration/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="z-10 text-white space-y-6 max-w-lg">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3v8h8a10.003 10.003 0 01-5.461 8.946l-.054.09" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold leading-tight">Elevate Your Team&apos;s Productivity</h2>
          <p className="text-indigo-100 text-lg">
            Manage projects, assign tasks, and track progress with ease. Our Team Task Manager helps your team stay aligned and hit deadlines faster.
          </p>
          
          <div className="flex -space-x-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-xs font-bold ring-2 ring-indigo-600">
                U{i}
              </div>
            ))}
            <div className="pl-4 flex items-center text-sm font-medium text-indigo-100">
              Joined by 10k+ teams worldwide
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
