import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Brain, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function QuizGenerator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [topic, setTopic] = useState(location.state?.topic || 'Percentages');
  const [category, setCategory] = useState(location.state?.category || 'Quantitative Aptitude');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  const topicsList = [
    'Percentages', 'Number System', 'HCF & LCM', 'Profit and Loss', 
    'Time and Work', 'Time Speed Distance', 'Syllogism', 'Coding-Decoding', 
    'Reading Comprehension', 'Grammar'
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await API.post('/quiz/generate', {
        topic,
        category,
        difficulty,
        count: Number(count)
      });

      if (res.data.success && res.data.questions) {
        showToast(`Generated ${res.data.questions.length} AI questions!`, 'success');
        navigate('/quiz-runner', {
          state: {
            topic,
            category,
            difficulty,
            questions: res.data.questions
          }
        });
      }
    } catch (err) {
      showToast('Error generating AI quiz. Loading sample test setup.', 'error');
      // Fallback test runner payload if backend error
      navigate('/quiz-runner', {
        state: {
          topic,
          category,
          difficulty,
          questions: Array.from({ length: Number(count) }).map((_, i) => ({
            question: `Practice Question ${i + 1} for ${topic}: Which formula correctly solves the ratio balance?`,
            options: [`Option A for ${topic}`, `Option B for ${topic}`, `Option C for ${topic}`, `Option D for ${topic}`],
            correctAnswer: `Option B for ${topic}`,
            explanation: `Applying the standard ${topic} theorem yields Option B.`
          }))
        }
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Quiz Generator</h1>
        <p className="text-sm text-slate-400">Configure topic & difficulty. Gemini AI will generate structured placement questions.</p>
      </div>

      {/* Config Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Topic Input / Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type topic e.g. Percentages, Syllogism..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-white font-medium text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {topicsList.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  topic === t ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all ${
                  difficulty === d
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Number of Questions</label>
          <div className="grid grid-cols-4 gap-3">
            {[5, 10, 15, 20].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                  count === c
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c} Qs
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-50 mt-4"
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Questions with Gemini AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate & Start AI Quiz
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

      </div>

    </div>
  );
}
