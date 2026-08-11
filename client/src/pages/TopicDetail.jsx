import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import API from '../services/api';
import LoadingState from '../components/LoadingState';

export default function TopicDetail() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  const formattedTitle = topic ? topic.replace(/-/g, ' ').replace(/\band\b/g, '&') : 'Percentages';

  useEffect(() => {
    const fetchTopicMaterial = async () => {
      try {
        const res = await API.get(`/materials/${topic}`);
        if (res.data.success && res.data.material) {
          setMaterial(res.data.material);
        }
      } catch (err) {
        console.warn('Backend material fallback loaded');
      } finally {
        setLoading(false);
      }
    };
    fetchTopicMaterial();
  }, [topic]);

  if (loading) return <LoadingState message={`Fetching study material for ${formattedTitle}...`} />;

  // Default fallback material if topic is missing from DB
  const displayMaterial = material || {
    category: 'Quantitative Aptitude',
    topic: formattedTitle.toUpperCase(),
    title: `Comprehensive Guide to ${formattedTitle}`,
    introduction: `${formattedTitle} is a foundational placement topic widely tested across TCS, Infosys, Wipro, Accenture, and product company technical rounds. Mastering core formulas and shortcuts guarantees speed and accuracy.`,
    concepts: [
      `Understand base ratios and conversion formulas for ${formattedTitle}.`,
      `Apply multiplicative factors to solve percentage increase/decrease problems in under 30 seconds.`,
      `Identify net effect formulas when two consecutive modifications are applied.`
    ],
    formulas: [
      { name: 'Standard Percentage Formula', formula: 'Value % = (Part / Total) * 100', description: 'Calculates the proportion of a subset relative to the total set.' },
      { name: 'Successive Change', formula: 'Net % = A + B + (A*B)/100', description: 'Computes cumulative change across two successive percentage modifications.' }
    ],
    shortcuts: [
      'Learn standard fraction-to-percentage tables: 1/6 = 16.66%, 1/8 = 12.5%, 1/12 = 8.33%.',
      'Use multiplying factors (1.20 for +20%, 0.80 for -20%) instead of long manual additions.'
    ],
    solvedExamples: [
      {
        question: `If a quantity is increased by 20% and subsequently decreased by 20%, what is the net percentage change?`,
        solution: `Net % = +20 - 20 + (20 * -20)/100 = 0 - 4 = -4% (a net 4% loss).`,
        explanation: `The base changes after the first 20% increase, causing the 20% reduction to subtract a larger absolute number.`
      }
    ],
    commonMistakes: [
      `Failing to update the base value in multi-step percentage problems.`,
      `Assuming equal opposite percentage changes cancel out.`
    ],
    interviewTips: [
      `In TCS NQT, apply fraction equivalencies directly to save calculation time on multi-part word problems.`
    ]
  };

  const handleStartQuiz = () => {
    navigate('/quiz-generator', { state: { topic: displayMaterial.topic, category: displayMaterial.category } });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <Link to="/materials" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to All Study Materials
        </Link>
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase">
          {displayMaterial.category}
        </span>
      </div>

      {/* Main Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white capitalize">
          {displayMaterial.topic}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {displayMaterial.introduction}
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={handleStartQuiz}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Start Topic Quiz
          </button>
        </div>
      </div>

      {/* Core Concepts */}
      <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Core Concepts
        </h2>
        <div className="space-y-2.5">
          {displayMaterial.concepts.map((c, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulas & Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Formulas */}
        <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Important Formulas
          </h2>
          <div className="space-y-3">
            {displayMaterial.formulas.map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1.5">
                <p className="text-xs font-bold text-amber-300">{f.name}</p>
                <div className="font-mono text-sm text-white font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shortcuts */}
        <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-violet-400" />
            Time-Saving Shortcuts
          </h2>
          <div className="space-y-3">
            {displayMaterial.shortcuts.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                ⚡ {s}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Solved Examples */}
      <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Solved Examples</h2>
        <div className="space-y-4">
          {displayMaterial.solvedExamples.map((ex, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <p className="text-sm font-semibold text-white">
                <span className="text-indigo-400 font-bold mr-2">Q{idx + 1}.</span>
                {ex.question}
              </p>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 space-y-1">
                <p className="text-xs font-bold text-indigo-300">Solution:</p>
                <p className="text-xs font-mono text-slate-200">{ex.solution}</p>
              </div>
              <p className="text-xs text-slate-400 italic">Explanation: {ex.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Quiz Banner CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to test your knowledge on {displayMaterial.topic}?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">Generate a custom AI quiz tailored to your target difficulty level.</p>
        <button
          onClick={handleStartQuiz}
          className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2"
        >
          Generate AI Quiz Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
