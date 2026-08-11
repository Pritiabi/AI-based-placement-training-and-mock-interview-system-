import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Flame, Sparkles, BookOpen, Clock } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function Notifications() {
  const { showToast } = useNotification();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/progress/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
        }
      } catch (err) {}
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/progress/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      showToast('Notification marked as read', 'info');
    } catch (e) {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-400" />
            Notifications & Placement Alerts
          </h1>
          <p className="text-sm text-slate-400 mt-1">Stay updated with daily challenges, quiz updates, and performance milestones.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              n.read 
                ? 'glass-card border-slate-800/80 opacity-75' 
                : 'glass-panel border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-slate-900'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                n.type === 'challenge' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
              }`}>
                {n.type === 'challenge' ? <Flame className="w-5 h-5 fill-amber-500" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{n.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {!n.read && (
              <button
                onClick={() => handleMarkRead(n._id)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 text-xs font-semibold shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
