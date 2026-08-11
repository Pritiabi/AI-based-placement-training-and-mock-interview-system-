import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Sparkles, ArrowRight, History, Award, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

export default function AptitudeModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Quantitative Aptitude');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/quiz/history');
        if (res.data.success) {
          setHistory(res.data.attempts || []);
        }
      } catch (e) {}
    };
    fetchHistory();
  }, []);

  const categories = [
    { name: 'Quantitative Aptitude', desc: 'Numbers, Percentages, Time & Work, Speed, Ratios & Algebra' },
    { name: 'Logical Reasoning', desc: 'Syllogism, Coding-Decoding, Puzzles, Series & Blood Relations' },
    { name: 'Verbal Ability', desc: 'Grammar, Reading Comprehension, Synonyms, Vocabulary & Para Jumbles' }
  ];

  const topics = {
    'Quantitative Aptitude': ['Percentages', 'HCF & LCM', 'Profit and Loss', 'Time and Work', 'Time Speed Distance'],
    'Logical Reasoning': ['Syllogism', 'Coding-Decoding', 'Blood Relations', 'Number Series', 'Seating Arrangement'],
    'Verbal Ability': ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Sentence Correction', 'Para Jumbles']
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-amber-400" />
          Aptitude Preparation Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">Master Quantitative, Logical, and Verbal topics tested in written placement tests.</p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveTab(cat.name)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              activeTab === cat.name
                ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border-indigo-500 text-white shadow-lg'
                : 'glass-panel border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <h3 className="text-base font-bold text-white mb-1">{cat.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
          </button>
        ))}
      </div>

      {/* Topic Grid for Selected Category */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center justify-between">
          <span>{activeTab} Topics</span>
          <Link to="/materials" className="text-xs text-indigo-400 hover:underline">View All Topics →</Link>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(topics[activeTab] || []).map((t, idx) => {
            const slug = t.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
            return (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-base font-bold text-white">{t}</h4>
                <div className="flex gap-2">
                  <Link
                    to={`/materials/${slug}`}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Study Concept
                  </Link>
                  <button
                    onClick={() => navigate('/quiz-generator', { state: { topic: t, category: activeTab } })}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-center text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Quiz Attempts Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Recent Aptitude Quiz Attempts
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500">No previous quiz attempts found. Start a quiz above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Topic</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.slice(0, 5).map((att) => (
                  <tr key={att._id}>
                    <td className="py-3 font-semibold text-white">{att.topic}</td>
                    <td className="py-3 text-slate-400">{att.category}</td>
                    <td className="py-3 font-bold text-indigo-400">{att.score} / {att.totalQuestions}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold">
                        {att.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{new Date(att.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
