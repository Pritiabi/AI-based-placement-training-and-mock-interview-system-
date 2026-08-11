import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, RotateCcw, BookOpen } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function QuizInterface() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const quizConfig = location.state || {};
  const questions = quizConfig.questions || [
    {
      question: 'A candidate secures 178 marks and fails by 22 marks in an exam requiring 40% to pass. What is the max marks?',
      options: ['400', '500', '600', '450'],
      correctAnswer: '500',
      explanation: 'Passing marks = 178 + 22 = 200. Max marks = (200 * 100) / 40 = 500.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(questions.length * 45);
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSelectOption = (opt) => {
    if (submitted) return;
    setUserAnswers({ ...userAnswers, [currentIndex]: opt });
  };

  const handleSubmitQuiz = async () => {
    if (submitted || submitting) return;
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((_, i) => userAnswers[i] || '');
      const res = await API.post('/quiz/submit', {
        topic: quizConfig.topic || 'Percentages',
        category: quizConfig.category || 'Quantitative Aptitude',
        difficulty: quizConfig.difficulty || 'Medium',
        userAnswers: formattedAnswers,
        questions,
        timeTakenSeconds: (questions.length * 45) - secondsLeft
      });

      if (res.data.success) {
        setQuizResult(res.data);
        setSubmitted(true);
        showToast(`Quiz Submitted! Score: ${res.data.score}/${res.data.totalQuestions}`, 'success');
      }
    } catch (err) {
      // Fallback evaluation if server fails
      let correct = 0;
      const evalQs = questions.map((q, idx) => {
        const uAns = userAnswers[idx] || '';
        const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (isCorrect) correct++;
        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: uAns,
          isCorrect,
          explanation: q.explanation
        };
      });
      const pct = Math.round((correct / questions.length) * 100);
      setQuizResult({
        score: correct,
        totalQuestions: questions.length,
        percentage: pct,
        accuracy: pct,
        evaluatedQuestions: evalQs
      });
      setSubmitted(true);
      showToast('Quiz submitted offline mode', 'info');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {quizConfig.category || 'Aptitude Test'} • {quizConfig.difficulty || 'Medium'}
          </span>
          <h1 className="text-xl font-bold text-white mt-0.5">{quizConfig.topic || 'Percentages'} AI Quiz</h1>
        </div>

        {!submitted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-400 font-mono font-bold text-base shadow">
            <Clock className="w-5 h-5 animate-pulse" />
            <span>Timer: {formatTimer(secondsLeft)}</span>
          </div>
        )}
      </div>

      {/* QUIZ IN-PROGRESS VIEW */}
      {!submitted ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Question Counter Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-sm font-bold text-indigo-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentIndex === idx 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : userAnswers[idx] 
                        ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30' 
                        : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isSelected = userAnswers[currentIndex] === opt;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {optionLetters[optIdx] || optIdx + 1}
                  </div>
                  <span className="text-sm font-medium flex-1">{opt}</span>
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

            {currentIndex < questions.length - 1 ? (
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
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>

        </div>
      ) : (
        /* QUIZ RESULT SCORE & DETAILED EXPLANATIONS VIEW */
        <div className="space-y-8">
          
          {/* Score Summary Card */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center space-y-6 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950">
            <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce-short" />
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">Quiz Evaluation Completed</h2>
              <p className="text-slate-400 text-sm">Here is your performance breakdown for {quizConfig.topic}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Score</p>
                <p className="text-2xl font-black text-white">{quizResult.score} / {quizResult.totalQuestions}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Percentage</p>
                <p className="text-2xl font-black text-indigo-400">{quizResult.percentage}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Correct Answers</p>
                <p className="text-2xl font-black text-emerald-400">{quizResult.score}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Accuracy</p>
                <p className="text-2xl font-black text-violet-400">{quizResult.accuracy}%</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/quiz-generator"
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake New Quiz
              </Link>
              <Link
                to="/study-materials"
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-300 glass-panel border border-slate-800 hover:text-white"
              >
                Back to Study Materials
              </Link>
            </div>
          </div>

          {/* Question-by-Question Explanation Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Detailed Solutions & Explanations
            </h3>

            {(quizResult.evaluatedQuestions || questions).map((q, idx) => {
              const isCorrect = q.isCorrect !== undefined 
                ? q.isCorrect 
                : (userAnswers[idx] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

              return (
                <div key={idx} className={`p-6 rounded-2xl border space-y-4 ${
                  isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}>
                  
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base font-semibold text-white flex items-start gap-2">
                      <span className="text-slate-400">Q{idx + 1}.</span>
                      {q.question}
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
                        {userAnswers[idx] || q.userAnswer || 'Not Answered'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 font-semibold block mb-1">Correct Answer:</span>
                      <span className="font-bold text-emerald-400">{q.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-indigo-300 block mb-1">Step-by-Step Explanation:</span>
                    {q.explanation}
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
