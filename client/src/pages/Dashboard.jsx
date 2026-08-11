import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Mic, 
  Code2, 
  Brain, 
  MessageSquare, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCheck2,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import LoadingState from '../components/LoadingState';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    resumeScore: 82,
    interviewScore: 76,
    codingScore: 65,
    aptitudeScore: 72,
    communicationScore: 78,
    streak: user?.streak || 7
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get('/progress');
        if (res.data.success && res.data.progress) {
          setProgressData({
            resumeScore: res.data.progress.resumeScore || 82,
            interviewScore: res.data.progress.interviewScore || 76,
            codingScore: res.data.progress.codingScore || 65,
            aptitudeScore: res.data.progress.aptitudeScore || 72,
            communicationScore: res.data.progress.communicationScore || 78,
            streak: res.data.userStreak || 7
          });
        }
      } catch (err) {
        console.warn('Using default progress dataset:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <LoadingState message="Preparing your placement metrics..." />;

  const metricCards = [
    { title: 'Resume Score', score: progressData.resumeScore, suffix: '%', icon: FileText, color: 'text-indigo-400', bg: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20' },
    { title: 'Interview Score', score: progressData.interviewScore, suffix: '%', icon: Mic, color: 'text-violet-400', bg: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/20' },
    { title: 'Coding Progress', score: progressData.codingScore, suffix: '%', icon: Code2, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20' },
    { title: 'Aptitude Progress', score: progressData.aptitudeScore, suffix: '%', icon: Brain, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20' },
    { title: 'Communication Score', score: progressData.communicationScore, suffix: '%', icon: MessageSquare, color: 'text-pink-400', bg: 'from-pink-500/10 to-pink-600/5', border: 'border-pink-500/20' },
    { title: 'Current Streak', score: `${progressData.streak} Days`, suffix: ' 🔥', icon: Flame, color: 'text-amber-400', bg: 'from-amber-500/15 to-orange-600/10', border: 'border-amber-500/30' }
  ];

  const todayGoals = [
    { label: '5 Aptitude Questions', category: 'Quant / Logical' },
    { label: '2 Coding Problems', category: 'Python / Java' },
    { label: '3 HR Questions', category: 'Behavioral' },
    { label: '1 Communication Practice', category: 'Speaking' },
    { label: '1 Interview Practice', category: 'AI Mock Round' }
  ];

  const quickActions = [
    { title: 'Resume Builder', desc: 'Polish bullet points & export PDF', icon: FileText, route: '/resume', color: 'from-blue-600 to-indigo-600' },
    { title: 'ATS Checker', desc: 'Scan uploaded resume for ATS score', icon: FileCheck2, route: '/ats', color: 'from-purple-600 to-pink-600' },
    { title: 'Aptitude Practice', desc: 'Topic-wise concepts & AI quiz', icon: Brain, route: '/aptitude', color: 'from-amber-600 to-orange-600' },
    { title: 'Coding Practice', desc: 'Solve LeetCode-style tech problems', icon: Code2, route: '/coding', color: 'from-emerald-600 to-teal-600' },
    { title: 'Mock Interview', desc: 'Simulate HR & Technical rounds', icon: Mic, route: '/interview', color: 'from-violet-600 to-purple-600' },
    { title: 'Communication', desc: 'AI speech evaluation & grammar', icon: MessageSquare, route: '/communication', color: 'from-pink-600 to-rose-600' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Candidate Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Welcome, {user?.name || 'Abirami'} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            "Ready to improve your placement skills today?" Track your metrics and complete challenges.
          </p>
        </div>

        <button
          onClick={() => navigate('/challenge')}
          className="z-10 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 shrink-0 hover:scale-105"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          Start Today's Challenge
        </button>

        {/* Decorative ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className={`glass-card p-5 rounded-2xl border ${m.border} bg-gradient-to-b ${m.bg} space-y-3 relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 truncate">{m.title}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {m.score}<span className="text-lg text-slate-400 font-bold">{m.suffix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Goal & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Goal Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Today's Goal
                </h3>
                <p className="text-xs text-slate-400">Complete 5 tasks to maintain your streak</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                {progressData.streak} Days 🔥
              </span>
            </div>

            <div className="space-y-3">
              {todayGoals.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-slate-200">{g.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">{g.category}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/challenge')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            Start Today's Challenge
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Quick Access Modules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={i}
                  to={qa.route}
                  className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-3 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${qa.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                      {qa.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{qa.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
