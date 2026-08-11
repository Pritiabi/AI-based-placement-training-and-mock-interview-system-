import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle2, ShieldCheck, Zap, BookOpen, Code2, Mic, Lightbulb } from 'lucide-react';
import API from '../services/api';
import LoadingState from '../components/LoadingState';

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get(`/companies/${id}`);
        if (res.data.success && res.data.company) {
          setCompany(res.data.company);
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <LoadingState message="Fetching company placement profile..." />;

  const display = company || {
    name: id ? id.toUpperCase() : 'TCS',
    fullName: 'Tata Consultancy Services',
    overview: 'India\'s largest IT services company hiring thousands of engineering graduates.',
    eligibility: '60% throughout academics (10th, 12th, B.Tech). Max 1 active backlog.',
    selectionProcess: [
      'Phase 1: Online Test (Aptitude + Pseudocode + Coding)',
      'Phase 2: Technical Interview',
      'Phase 3: Managerial & HR Interview'
    ],
    aptitudePattern: 'Numerical Ability (20 Qs / 40 mins), Verbal Ability (25 Qs / 30 mins), Reasoning Ability (20 Qs / 50 mins).',
    technicalTopics: ['C / C++ Basics', 'SQL & DBMS Queries', 'Data Structures (Arrays, Strings)', 'OOP Concepts'],
    codingPattern: '2 Questions in 45 mins. (1 Easy logic problem, 1 Array/String matrix problem).',
    hrTopics: ['Tell me about yourself', 'Why TCS?', 'Willingness to relocate & work in shifts'],
    tips: ['Practice past NQT questions for Quantitative Aptitude.', 'Ensure speed & accuracy.']
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Nav */}
      <Link to="/company" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to All Company Preparation Profiles
      </Link>

      {/* Main Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
            {display.logo || '🏢'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">{display.name}</h1>
            <p className="text-xs font-semibold text-sky-400">{display.fullName}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{display.overview}</p>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="font-bold text-sky-300">Eligibility Criteria:</span> {display.eligibility}
        </div>
      </div>

      {/* Selection Process Rounds */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          Selection Process & Rounds
        </h3>
        <div className="space-y-2">
          {display.selectionProcess.map((round, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{round}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aptitude & Technical & Coding Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Aptitude Pattern
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{display.aptitudePattern}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            Coding Round Pattern
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{display.codingPattern}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-pink-400" />
            HR Round Topics
          </h4>
          <ul className="space-y-1 text-xs text-slate-300">
            {display.hrTopics.map((t, idx) => <li key={idx}>• {t}</li>)}
          </ul>
        </div>

      </div>

      {/* Preparation Tips */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Pro Preparation Tips for {display.name}
        </h3>
        <div className="space-y-2">
          {display.tips.map((tip, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              ⚡ {tip}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
