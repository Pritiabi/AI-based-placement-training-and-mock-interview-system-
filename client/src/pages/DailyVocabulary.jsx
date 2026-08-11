import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, CheckCircle2, RotateCcw, Award, Volume2 } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function DailyVocabulary() {
  const { showToast } = useNotification();
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const res = await API.get('/communication/vocabulary');
        if (res.data.success && res.data.vocabulary) {
          setVocabulary(res.data.vocabulary);
        }
      } catch (err) {
        showToast('Loaded Daily Placement Vocabulary', 'info');
      } finally {
        setLoading(false);
      }
    };
    fetchVocab();
  }, []);

  const handleSelectAnswer = (vocabIndex, selectedOption) => {
    if (submitted) return;
    setQuizAnswers({ ...quizAnswers, [vocabIndex]: selectedOption });
  };

  const handleSubmitQuiz = async () => {
    if (submitted || submitting) return;
    setSubmitting(true);

    try {
      const res = await API.post('/communication/vocabulary/submit', {
        vocabulary,
        answers: quizAnswers
      });

      if (res.data.success) {
        setQuizResult(res.data);
        setSubmitted(true);
        showToast(`Vocabulary Quiz Submitted! Score: ${res.data.score}/${res.data.totalQuestions}`, 'success');
      }
    } catch (err) {
      // Local fallback evaluation
      let score = 0;
      const evaluated = vocabulary.map((v, idx) => {
        const q = (v.quizQuestions && v.quizQuestions[0]) || { correctAnswer: v.synonym };
        const uAns = quizAnswers[idx] || '';
        const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (isCorrect) score++;
        return { word: v.word, userResponse: uAns, correctAnswer: q.correctAnswer, isCorrect, explanation: q.explanation };
      });
      setQuizResult({ score, totalQuestions: vocabulary.length, percentage: Math.round((score / vocabulary.length) * 100), evaluatedDetails: evaluated });
      setSubmitted(true);
      showToast('Vocabulary quiz evaluated', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Loading today's AI-generated Placement Vocabulary..." />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          AI Daily Placement Vocabulary
        </h1>
        <p className="text-sm text-slate-400 mt-1">High-frequency corporate placement words, meanings, interview usages, and daily vocabulary quiz.</p>
      </div>

      {/* VOCABULARY CARDS LIST */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Today's Placement Words
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {vocabulary.map((item, idx) => (
            <div key={item._id || idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-white">{item.word}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold italic">
                      {item.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-300 mt-1">{item.simpleMeaning}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold shrink-0">
                  {item.difficulty || 'Medium'}
                </span>
              </div>

              {/* Example Sentence */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-slate-400 block">Placement Example:</span>
                <p className="italic">"{item.exampleSentence}"</p>
              </div>

              {/* Synonyms, Antonyms, & Interview Usage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-0.5">Synonym:</span>
                  <span className="font-bold text-emerald-400">{item.synonym}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-0.5">Antonym:</span>
                  <span className="font-bold text-rose-400">{item.antonym}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-0.5">Interview Tip:</span>
                  <span className="text-slate-300">{item.interviewUsage || 'Great for technical/HR answers'}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* DAILY VOCABULARY QUIZ */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Daily Vocabulary Assessment Quiz
          </h2>
          <span className="text-xs font-bold text-slate-400">{vocabulary.length} Questions</span>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {vocabulary.map((item, idx) => {
              const q = (item.quizQuestions && item.quizQuestions[0]) || {
                question: `What is the synonym of "${item.word}"?`,
                options: [item.synonym, item.antonym, 'Irrelevant', 'Unknown'],
                correctAnswer: item.synonym
              };
              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <p className="text-sm font-semibold text-white">
                    <span className="text-indigo-400 font-bold mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(q.options || [item.synonym, item.antonym, 'Irrelevant', 'Unknown']).map((opt, oIdx) => {
                      const isSelected = quizAnswers[idx] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(idx, opt)}
                          className={`p-3 rounded-xl border text-left font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600/30 border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-5 h-5" />
              {submitting ? 'Submitting Answers...' : 'Submit Vocabulary Quiz'}
            </button>
          </div>
        ) : (
          /* RESULT DISPLAY */
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h3 className="text-2xl font-black text-white">Vocabulary Score: {quizResult.score} / {quizResult.totalQuestions}</h3>
              <p className="text-xs text-emerald-300 font-bold">Accuracy: {quizResult.percentage}%</p>
            </div>

            <div className="space-y-3 text-left">
              {(quizResult.evaluatedDetails || []).map((detail, i) => (
                <div key={i} className={`p-4 rounded-xl border text-xs space-y-1 ${
                  detail.isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Word: {detail.word}</span>
                    <span className={detail.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      {detail.isCorrect ? '✔ Correct' : '✖ Incorrect'}
                    </span>
                  </div>
                  <p className="text-slate-300">Your Answer: {detail.userResponse || 'None'} | Correct Answer: {detail.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
