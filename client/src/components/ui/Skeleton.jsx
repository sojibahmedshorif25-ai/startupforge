import React from 'react';

export default function Skeleton({ className = '', type = 'text', count = 1 }) {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl";
  
  if (type === 'card') {
    return (
      <div className={`card p-6 space-y-4 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        </div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`${baseClasses} ${className}`} />
      ))}
    </div>
  );
}
