import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  Code2, 
  Mic, 
  MessageSquare, 
  FileText, 
  FileCheck2, 
  Building2, 
  Flame, 
  BarChart3, 
  Bell, 
  User, 
  Settings, 
  ShieldAlert,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Materials', path: '/materials', icon: BookOpen },
    { name: 'Aptitude Prep', path: '/aptitude', icon: Brain },
    { name: 'Coding Practice', path: '/coding', icon: Code2 },
    { name: 'AI Mock Interview', path: '/interview', icon: Mic },
    { name: 'Communication', path: '/communication', icon: MessageSquare },
    { name: 'Resume Builder', path: '/resume', icon: FileText },
    { name: 'ATS Checker', path: '/ats', icon: FileCheck2 },
    { name: 'Company Prep', path: '/company', icon: Building2 },
    { name: 'Daily Challenge', path: '/challenge', icon: Flame, badge: 'Hot' },
    { name: 'Progress Analytics', path: '/progress', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, badge: 'Admin' });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 glass-panel border-r border-slate-800/80 
        flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Top Logo & Close Button */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PlacePrep<span className="text-indigo-400">.AI</span>
              </span>
            </NavLink>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      item.badge === 'Admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card Bottom */}
        <div className="p-4 border-t border-slate-800/80">
          <NavLink to="/profile" className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm uppercase shadow">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Student Aspirant'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.department || 'Computer Science'}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
