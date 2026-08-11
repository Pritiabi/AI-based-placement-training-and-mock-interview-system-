import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Code2, 
  Mic, 
  FileText, 
  FileCheck2, 
  Building2, 
  Flame, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  Award,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    { title: 'AI Resume Builder', desc: 'Craft ATS-optimized resumes with AI description polisher.', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { title: 'AI ATS Resume Checker', desc: 'Scan uploaded PDF/DOCX resumes for calculated ATS score out of 100.', icon: FileCheck2, color: 'from-violet-500 to-purple-600' },
    { title: 'Aptitude Preparation', desc: 'Master Quant, Logical Reasoning & Verbal Ability topics.', icon: Brain, color: 'from-amber-500 to-orange-600' },
    { title: 'Coding Practice', desc: 'Practice Python, Java, C++, SQL problems with AI solution explanations.', icon: Code2, color: 'from-emerald-500 to-teal-600' },
    { title: 'Communication Training', desc: 'Voice-based speaking practice with instant AI grammar & fluency feedback.', icon: Mic, color: 'from-pink-500 to-rose-600' },
    { title: 'AI Mock Interviews', desc: 'Simulate realistic HR & Technical interviews with voice recording and reports.', icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
    { title: 'Company Preparation', desc: 'Targeted hiring pattern guides for TCS, Infosys, Zoho, Amazon & more.', icon: Building2, color: 'from-indigo-500 to-sky-600' },
    { title: 'Progress Analytics', desc: 'Track weekly score growth, streak 🔥, and skill mastery with charts.', icon: BarChart3, color: 'from-purple-500 to-pink-600' }
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Set up your academic details, target roles, and college info.' },
    { num: '02', title: 'Learn Study Materials', desc: 'Master topic formulas, concepts, shortcuts, and solved examples.' },
    { num: '03', title: 'Practice AI Quizzes', desc: 'Generate topic-wise quizzes with step-by-step explanations.' },
    { num: '04', title: 'Build & Check Resume', desc: 'Enhance your resume and verify your calculated ATS compatibility score.' },
    { num: '05', title: 'Attend AI Mock Interviews', desc: 'Practice HR & Technical interview rounds with speech-to-text recording.' },
    { num: '06', title: 'Get Placement Ready', desc: 'Track your streak 🔥, complete daily challenges, and land your dream offer.' }
  ];

  const stats = [
    { value: '10,000+', label: 'Practice Questions' },
    { value: '150+', label: 'Interview Topics' },
    { value: '50+', label: 'Tier-1 Tech Companies' },
    { value: '98%', label: 'Placement Accuracy Rate' },
    { value: '25,000+', label: 'AI Evaluations Generated' }
  ];

  return (
    <div className="space-y-24 py-12">
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider animate-bounce-short">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          AI-Powered Campus Placement Ecosystem
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
          AI-Based Placement Training & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Mock Interview System</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Prepare smarter. Practice better. Get placement-ready with AI. Master aptitude, coding, communication, ATS resume scoring, and realistic voice mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:scale-105"
            >
              Go to Your Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-300 hover:text-white glass-panel border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </>
          )}
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-slate-400 hover:text-white transition-colors"
          >
            Explore Features ↓
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Comprehensive Placement Modules</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">Everything you need to crack campus recruitments from aptitude online tests to HR & Technical interviews.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How PlacePrep AI Works</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">Follow a systematic 6-step roadmap engineered for high-salary campus placements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="text-5xl font-black text-indigo-500/10 absolute top-4 right-4">{step.num}</div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step {step.num}</span>
                <h4 className="text-xl font-bold text-white mt-1">{step.title}</h4>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section id="statistics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="glass-card p-10 sm:p-16 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Start Your Placement Preparation Today</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">Join thousands of engineering and IT candidates preparing for top campus recruitments.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/30"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
