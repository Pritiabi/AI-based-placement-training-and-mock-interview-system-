import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Award, RotateCcw, BookOpen, Clock, Code2 } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function CodingMCQRunner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const config = location.state || { language: 'Python', difficulty: 'Basic' };
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const res = await API.get(`/coding/mcqs?language=${config.language}&difficulty=${config.difficulty}`);
        if (res.data.success && res.data.mcqs && res.data.mcqs.length > 0) {
          setMcqs(res.data.mcqs);
        } else {
          // Fallback MCQs
          setMcqs([
            {
              _id: 'm1',
              question: `What is the correct syntax or behavior in ${config.language} (${config.difficulty} level)?`,
              optionA: `Standard evaluation A for ${config.language}`,
              optionB: `Correct expression B for ${config.language}`,
              optionC: `Alternative approach C for ${config.language}`,
              optionD: `Syntax error D for ${config.language}`,
              correctAnswer: 'B',
              explanation: `In ${config.language}, Option B provides the exact expected semantics and runtime behavior.`
            }
          ]);
        }
      } catch (err) {
        console.warn('Backend MCQ fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchMCQs();
  }, [config.language, config.difficulty]);

  const handleSelectOption = (letter) => {
    if (submitted) return;
    setUserAnswers({ ...userAnswers, [currentIndex]: letter });
  };

  const handleSubmitQuiz = async () => {
    if (submitted || submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = mcqs.map((_, i) => userAnswers[i] || '');
      const res = await API.post('/coding/submit-mcq', {
        language: config.language,
        difficulty: config.difficulty,
        mcqAnswers: formattedAnswers,
        mcqs
      });

      if (res.data.success) {
        setResult(res.data);
        setSubmitted(true);
        showToast(`MCQ Submitted! Score: ${res.data.score}/${res.data.totalQuestions}`, 'success');
      }
    } catch (err) {
      // Local fallback evaluation
      let correct = 0;
      const evaluated = mcqs.map((q, idx) => {
        const uAns = userAnswers[idx] || '';
        const isCorrect = uAns.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
        if (isCorrect) correct++;
        return {
          questionTitle: q.question,
          userResponse: uAns,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation
        };
      });
      const pct = Math.round((correct / mcqs.length) * 100);
      setResult({
        score: correct,
        totalQuestions: mcqs.length,
        percentage: pct,
        accuracy: pct,
        evaluatedDetails: evaluated
      });
      setSubmitted(true);
      showToast('MCQ submitted (local evaluation)', 'info');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message={`Fetching ${config.language} ${config.difficulty} MCQs...`} />;

  const currentQ = mcqs[currentIndex] || mcqs[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {config.language} • {config.difficulty} Level MCQ
          </span>
          <h1 className="text-xl font-bold text-white mt-0.5">Coding MCQ Practice</h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
          MCQ Mode
        </span>
      </div>

      {/* QUIZ IN-PROGRESS */}
      {!submitted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Navigator Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-indigo-300">
              Question {currentIndex + 1} of {mcqs.length}
            </span>
            <div className="flex gap-1.5 overflow-x-auto">
              {mcqs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentIndex === idx 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : userAnswers[idx] 
                        ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </h3>

          {/* Options A, B, C, D */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {[
              { letter: 'A', text: currentQ.optionA },
              { letter: 'B', text: currentQ.optionB },
              { letter: 'C', text: currentQ.optionC },
              { letter: 'D', text: currentQ.optionD }
            ].map((opt) => {
              const isSelected = userAnswers[currentIndex] === opt.letter;
              return (
                <button
                  key={opt.letter}
                  onClick={() => handleSelectOption(opt.letter)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.letter}
                  </div>
                  <span className="text-sm font-medium flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-300 glass-panel border border-slate-800 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>

            {currentIndex < mcqs.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-8 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                {submitting ? 'Submitting...' : 'Submit MCQ Test'}
              </button>
            )}
          </div>

        </div>
      ) : (
        /* MCQ RESULT SUMMARY & DETAILED EXPLANATIONS */
        <div className="space-y-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950">
            <Award className="w-16 h-16 text-amber-400 mx-auto" />
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">MCQ Evaluation Completed</h2>
              <p className="text-slate-400 text-sm">Performance summary for {config.language} ({config.difficulty} Level)</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Score</p>
                <p className="text-2xl font-black text-white">{result.score} / {result.totalQuestions}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Percentage</p>
                <p className="text-2xl font-black text-emerald-400">{result.percentage}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Correct Answers</p>
                <p className="text-2xl font-black text-indigo-400">{result.score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Accuracy</p>
                <p className="text-2xl font-black text-violet-400">{result.accuracy}%</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/coding"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Return to Coding Hub
              </Link>
            </div>
          </div>

          {/* Question-by-Question Explanation Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Detailed Explanations
            </h3>

            {(result.evaluatedDetails || mcqs).map((q, idx) => {
              const origQ = mcqs[idx] || {};
              const isCorrect = q.isCorrect !== undefined ? q.isCorrect : (userAnswers[idx] || '') === origQ.correctAnswer;

              return (
                <div key={idx} className={`p-6 rounded-2xl border space-y-4 ${
                  isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base font-semibold text-white flex items-start gap-2">
                      <span className="text-slate-400">Q{idx + 1}.</span>
                      {origQ.question || q.questionTitle}
                    </h4>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold shrink-0">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 font-semibold block mb-1">Your Answer:</span>
                      <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {userAnswers[idx] || q.userResponse || 'Not Answered'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 font-semibold block mb-1">Correct Answer:</span>
                      <span className="font-bold text-emerald-400">{origQ.correctAnswer || q.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-300 block mb-1">Explanation:</span>
                    {origQ.explanation || q.explanation}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
