import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, Lock, Bell, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Settings() {
  const { logout, forgotPassword, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      if (user?.email) {
        await forgotPassword(user.email);
        showToast(`Password reset link sent to ${user.email}`, 'success');
      }
    } catch (e) {
      showToast('Error sending reset link', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Signed out of PlacePrep AI', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-400" />
          Account & Application Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage preferences, security settings, and interface theme.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Appearance Theme */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Interface Theme</h4>
            <p className="text-xs text-slate-400">Toggle between dark mode and light mode appearance.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-2"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
          </button>
        </div>

        {/* Password & Security */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Security & Password</h4>
            <p className="text-xs text-slate-400">Send Firebase password reset email to your registered account.</p>
          </div>
          <button
            onClick={handleResetPassword}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-400 flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            Send Password Reset Link
          </button>
        </div>

        {/* Profile Link */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Profile Details</h4>
            <p className="text-xs text-slate-400">Update college name, degree, department, and graduation year.</p>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            Manage Profile
          </Link>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of PlacePrep AI
          </button>
        </div>

      </div>

    </div>
  );
}
