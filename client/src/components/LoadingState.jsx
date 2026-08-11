import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading content...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping opacity-75" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}
