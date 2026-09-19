import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FolderOpen, 
  title = "No items found", 
  description = "There are no records to display at this moment.",
  actionLabel,
  onAction 
}) {
  return (
    <div className="card p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto border-dashed">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary py-2.5 text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
