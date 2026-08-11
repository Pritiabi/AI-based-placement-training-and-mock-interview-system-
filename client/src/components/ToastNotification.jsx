import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function ToastNotification() {
  const { toast, hideToast } = useNotification();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
    info: 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md w-full">
      <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button onClick={hideToast} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
