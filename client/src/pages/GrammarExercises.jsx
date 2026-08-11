import React, { useState } from 'react';
import { BookMarked, Sparkles, CheckCircle2, Award, RotateCcw, ArrowRight } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function GrammarExercises() {
  const { showToast } = useNotification();
  const [topic, setTopic] = useState('Tenses');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const topicsList = [
    'Tenses', 'Articles', 'Prepositions', 'Subject-Verb Agreement', 
    'Active and Passive Voice', 'Direct and Indirect Speech', 
    'Sentence Correction', 'Error Detection', 'Conjunctions', 
    'Pronouns', 'Adjectives', 'Adverbs'
  ];

  const handleGenerateGrammar = async () => {
    setLoading(true);
    setSubmitted(false);
    setResult(null);
    setUserAnswers({});

    try {
      const res = await API.post('/communication/grammar/generate', { topic, difficulty, count: 5 });
      if (res.data.success && res.data.questions) {
        setQuestions(res.data.questions);
        showToast(`Generated ${res.data.questions.length} Grammar Questions for ${topic}`, 'success');
      }
    } catch (err) {
      showToast('Loaded practice grammar exercises', 'info');
      setQuestions([
        {
          question: `Select the correct sentence regarding ${topic} (${difficulty} level):`,
          options: [
            `Correct placement option A for ${topic}`,
            `Faulty grammatical structure B for ${topic}`,
            `Incorrect agreement C for ${topic}`,
            `Dangling reference D for ${topic}`
          ],
          correctAnswer: `Correct placement option A for ${topic}`,
          explanation: `In ${topic}, Option A strictly follows formal academic and placement English grammar rules.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, opt) => {
    if (submitted) return;
    setUserAnswers({ ...userAnswers, [qIdx]: opt });
  };

  const handleSubmitGrammar = async () => {
    if (submitted || submitting) return;
    setSubmitting(true);

    try {
      const res = await API.post('/communication/grammar/submit', {
        topic,
        difficulty,
        questions,
        userAnswers
      });

      if (res.data.success) {
        setResult(res.data);
        setSubmitted(true);
        showToast(`Grammar Score: ${res.data.score}/${res.data.totalQuestions}`, 'success');
      }
    } catch (err) {
      let score = 0;
      const evaluated = questions.map((q, idx) => {
        const uAns = userAnswers[idx] || '';
        const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (isCorrect) score++;
        return { question: q.question, userResponse: uAns, correctAnswer: q.correctAnswer, isCorrect, explanation: q.explanation };
      });
      setResult({ score, totalQuestions: questions.length, percentage: Math.round((score / questions.length) * 100), evaluatedDetails: evaluated });
      setSubmitted(true);
      showToast('Grammar exercises evaluated', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <BookMarked className="w-8 h-8 text-violet-400" />
          AI Placement Grammar Exercises
        </h1>
        <p className="text-sm text-slate-400 mt-1">Master verbal ability rules, sentence corrections, error detections, and tenses for placement tests.</p>
      </div>

      {/* SETUP CONTROLS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-violet-400" />
          Grammar Exercise Configurator
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Grammar Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-violet-500"
            >
              {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {['Basic', 'Medium', 'Hard'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    difficulty === d 
                      ? 'bg-violet-600 border-violet-500 text-white shadow-md' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateGrammar}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 disabled:opacity-40"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          {loading ? 'Generating AI Grammar Questions...' : `Generate ${topic} Questions (${difficulty})`}
        </button>
      </div>

      {/* QUESTIONS & QUIZ RUNNER */}
      {questions.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              {topic} Grammar Practice
            </h3>
            <span className="text-xs font-bold text-slate-400">{questions.length} Questions</span>
          </div>

          {!submitted ? (
            <div className="space-y-6">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <p className="text-sm font-semibold text-white">
                    <span className="text-violet-400 font-bold mr-2">Q{qIdx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(q.options || []).map((opt, oIdx) => {
                      const isSelected = userAnswers[qIdx] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(qIdx, opt)}
                          className={`p-3 rounded-xl border text-left font-medium transition-all ${
                            isSelected
                              ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitGrammar}
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
              >
                <CheckCircle2 className="w-5 h-5" />
                {submitting ? 'Submitting Answers...' : 'Submit Grammar Quiz'}
              </button>
            </div>
          ) : (
            /* RESULT DISPLAY */
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-2xl bg-violet-950/20 border border-violet-500/30 space-y-2">
                <h3 className="text-2xl font-black text-white">Grammar Score: {result.score} / {result.totalQuestions}</h3>
                <p className="text-xs text-violet-300 font-bold">Accuracy: {result.percentage}%</p>
              </div>

              <div className="space-y-3 text-left">
                {(result.evaluatedDetails || []).map((detail, i) => (
                  <div key={i} className={`p-4 rounded-xl border text-xs space-y-2 ${
                    detail.isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                  }`}>
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Q{i + 1}: {detail.question}</span>
                      <span className={detail.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                        {detail.isCorrect ? '✔ Correct' : '✖ Incorrect'}
                      </span>
                    </div>
                    <p className="text-slate-300">Your Answer: {detail.userResponse || 'None'} | Correct Answer: {detail.correctAnswer}</p>
                    <p className="text-slate-400 italic">Rule Explanation: {detail.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
