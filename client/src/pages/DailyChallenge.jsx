import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle2, Award, Zap, ArrowRight, Sparkles } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function DailyChallenge() {
  const { user, updateProfileData } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(user?.todayGoalCompleted || false);
  const [streak, setStreak] = useState(user?.streak || 7);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await API.get('/progress/challenge');
        if (res.data.success) {
          setChallenge(res.data.challenge);
        }
      } catch (err) {}
    };
    fetchChallenge();
  }, []);

  const handleCompleteChallenge = async () => {
    setSubmitting(true);
    try {
      const res = await API.post('/progress/challenge/complete');
      if (res.data.success) {
        setCompleted(true);
        setStreak(res.data.streak);
        if (user) {
          updateProfileData({ ...user, streak: res.data.streak, todayGoalCompleted: true });
        }
        showToast(`Challenge Completed! 🔥 ${res.data.streak} Day Streak Maintained!`, 'success');
      }
    } catch (err) {
      setCompleted(true);
      setStreak(streak + 1);
      showToast('Completed challenge (local mode)', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            Daily Placement Challenge
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {challenge?.title || "Today's Placement Challenge"}
          </h1>
          <p className="text-sm text-slate-400">Complete today's mixed tasks to increase your streak multiplier.</p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-2xl flex items-center gap-2 shadow">
          <Flame className="w-7 h-7 fill-amber-500 text-amber-500 animate-bounce-short" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white">Today's Task Checklist</h3>
          <span className="text-xs font-semibold text-slate-400">Date: {new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div className="space-y-3">
          {(challenge?.tasks || [
            { id: 't1', title: '5 Quantitative Aptitude Questions (Percentages)', targetRoute: '/aptitude' },
            { id: 't2', title: '2 Coding Problems (Python / Java Arrays)', targetRoute: '/coding' },
            { id: 't3', title: '3 HR Questions (Tell me about yourself, Strengths)', targetRoute: '/interview' },
            { id: 't4', title: '1 Communication & Speaking Assessment', targetRoute: '/communication' },
            { id: 't5', title: '1 AI Mock Interview Session', targetRoute: '/interview' }
          ]).map((task, idx) => (
            <div key={task.id || idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <CheckCircle2 className={`w-5 h-5 ${completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className="text-sm font-semibold text-white">{task.title}</span>
              </div>
              <button
                onClick={() => navigate(task.targetRoute)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1"
              >
                Go Practice
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {!completed ? (
          <button
            onClick={handleCompleteChallenge}
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
          >
            <Zap className="w-5 h-5 fill-white" />
            {submitting ? 'Updating Streak...' : 'Mark Today\'s Challenge Complete'}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
            <h4 className="text-base font-bold text-emerald-400">🔥 Today's Goal Fully Completed!</h4>
            <p className="text-xs text-slate-300">You earned +50 Placement XP and extended your streak to {streak} days.</p>
          </div>
        )}
      </div>

    </div>
  );
}
