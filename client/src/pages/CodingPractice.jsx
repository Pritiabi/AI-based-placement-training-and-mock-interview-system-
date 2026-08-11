import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, Brain, Sparkles, ArrowRight, Play, History, BarChart3, CheckCircle2, Terminal } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function CodingPractice() {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  // Wizard Selectors
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Basic');
  const [selectedType, setSelectedType] = useState('MCQ'); // 'MCQ' | 'Coding'

  // Data states
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for History
  const [historyLangFilter, setHistoryLangFilter] = useState('All');
  const [historyDiffFilter, setHistoryDiffFilter] = useState('All');

  const fetchCodingData = async () => {
    try {
      const [progRes, histRes] = await Promise.all([
        API.get('/coding/progress').catch(() => ({ data: { success: false } })),
        API.get('/coding/history').catch(() => ({ data: { success: false } }))
      ]);

      if (progRes.data.success) setProgress(progRes.data.progress);
      if (histRes.data.success) setHistory(histRes.data.attempts || []);
    } catch (err) {
      console.warn('Coding data loaded in dev fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodingData();
  }, []);

  const handleStartPractice = () => {
    if (selectedType === 'MCQ') {
      navigate('/coding-mcq', {
        state: {
          language: selectedLanguage,
          difficulty: selectedDifficulty
        }
      });
    } else {
      navigate('/coding-workspace', {
        state: {
          language: selectedLanguage,
          difficulty: selectedDifficulty
        }
      });
    }
  };

  if (loading) return <LoadingState message="Loading coding question bank & candidate progress..." />;

  const displayProgress = progress || {
    Python: { Basic: 80, Medium: 65, Hard: 40 },
    Java: { Basic: 75, Medium: 60, Hard: 35 },
    'C++': { Basic: 70, Medium: 55, Hard: 30 },
    SQL: { Basic: 90, Medium: 70, Hard: 45 }
  };

  const filteredHistory = history.filter(h => {
    const lMatch = historyLangFilter === 'All' || h.language === historyLangFilter;
    const dMatch = historyDiffFilter === 'All' || h.difficulty === historyDiffFilter;
    return lMatch && dMatch;
  });

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Code2 className="w-8 h-8 text-emerald-400" />
          Coding Practice & MCQ Module
        </h1>
        <p className="text-sm text-slate-400 mt-1">Master Python, Java, C++, and SQL across Basic, Medium, and Hard placement interview rounds.</p>
      </div>

      {/* PRACTICE SETUP WIZARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Practice Setup Wizard
        </h2>

        {/* Step 1: Select Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">1. Select Language</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Python', 'Java', 'C++', 'SQL'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`py-3.5 rounded-2xl font-extrabold text-sm border transition-all ${
                  selectedLanguage === lang
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">2. Select Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {['Basic', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Select Practice Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">3. Select Practice Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'MCQ', title: 'MCQ Practice', desc: 'Multiple Choice Questions with detailed explanations' },
              { id: 'Coding', title: 'Coding Questions', desc: 'Hands-on problem solving with test cases & AI review' }
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border-violet-500 text-white shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-white mb-0.5">{type.title}</div>
                <div className="text-xs text-slate-400">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Practice CTA */}
        <button
          onClick={handleStartPractice}
          className="w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 mt-4"
        >
          <Play className="w-5 h-5 fill-white" />
          START PRACTICE ({selectedLanguage} • {selectedDifficulty} • {selectedType})
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

      {/* LANGUAGE-WISE CODING PROGRESS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Language-Wise Candidate Accuracy & Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(displayProgress).map((lang) => (
            <div key={lang} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-base font-extrabold text-white">{lang}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                  Active
                </span>
              </div>

              {['Basic', 'Medium', 'Hard'].map((diff) => {
                const pct = displayProgress[lang]?.[diff] || 0;
                return (
                  <div key={diff} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{diff} Level</span>
                      <span className="font-bold text-indigo-400">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* MY CODING HISTORY TABLE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            My Coding & MCQ History
          </h2>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={historyLangFilter}
              onChange={(e) => setHistoryLangFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="All">All Languages</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="SQL">SQL</option>
            </select>

            <select
              value={historyDiffFilter}
              onChange={(e) => setHistoryDiffFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            >
              <option value="All">All Difficulties</option>
              <option value="Basic">Basic</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No practice history matching filters. Start a practice session above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredHistory.map((h, i) => (
                  <tr key={h._id || i}>
                    <td className="py-3 text-slate-400">{new Date(h.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3 font-semibold text-white">{h.language}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        h.difficulty === 'Basic' ? 'bg-emerald-500/20 text-emerald-300' :
                        h.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {h.difficulty}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-indigo-400">{h.type}</td>
                    <td className="py-3 font-bold text-white">{h.score} / {h.totalQuestions}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold">
                        {h.accuracy}%
                      </span>
                    </td>
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
