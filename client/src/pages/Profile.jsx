import React, { useState } from 'react';
import { User, Building, GraduationCap, Calendar, Mail, Save, Flame, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API from '../services/api';

export default function Profile() {
  const { user, updateProfileData } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || 'B.Tech',
    department: user?.department || 'Computer Science',
    graduationYear: user?.graduationYear || 2026
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success && res.data.user) {
        updateProfileData(res.data.user);
        showToast('Profile information updated in MongoDB!', 'success');
      }
    } catch (err) {
      updateProfileData({ ...user, ...formData });
      showToast('Profile updated locally', 'info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-white text-3xl shadow-xl uppercase">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Abirami Student'}</h1>
          <p className="text-xs text-slate-400">{user?.email} • {user?.degree} in {user?.department}</p>
          <p className="text-xs text-indigo-400 font-semibold">{user?.college || 'National Institute of Technology'}</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>{user?.streak || 7} Day Streak</span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Edit Academic & Personal Profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                required
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                required
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

    </div>
  );
}
