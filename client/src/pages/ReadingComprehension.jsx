import React, { useState } from 'react';
import { BookOpenText, Sparkles, CheckCircle2, Award, RotateCcw, HelpCircle } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function ReadingComprehension() {
  const { showToast } = useNotification();
  const [difficulty, setDifficulty] = useState('Medium');
  const [readingData, setReadingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleGeneratePassage = async () => {
    setLoading(true);
    setSubmitted(false);
    setResult(null);
    setUserAnswers({});

    try {
      const res = await API.get(`/communication/reading?difficulty=${difficulty}`);
      if (res.data.success && res.data.reading) {
        setReadingData(res.data.reading);
        showToast(`AI Reading Passage (${difficulty}) generated successfully!`, 'success');
      }
    } catch (err) {
      showToast('Loaded practice reading passage', 'info');
      setReadingData({
        title: 'Artificial Intelligence in Modern Enterprise Recruitment',
        difficulty,
        passage: `Artificial Intelligence has revolutionized campus placement drives across engineering institutions. Automating resume screening through Applicant Tracking Systems (ATS) enables recruiters to evaluate thousands of candidate profiles efficiently. However, technical interviews and communication evaluations require holistic assessment beyond keyword matching. Modern candidates must develop a balanced skill set comprising algorithm optimization, system design fundamentals, and clear verbal articulation.`,
        questions: [
          {
            type: 'Main idea',
            question: 'What is the primary theme of the passage?',
            options: ['The transformation of placement recruitment via AI', 'Why manual screening is better', 'How to write a resume', 'History of computers'],
            correctAnswer: 'The transformation of placement recruitment via AI',
            explanation: 'The passage highlights how AI revolutionizes recruitment and the balanced skill set candidates need.'
          },
          {
            type: 'Inference',
            question: 'What can be inferred about candidate preparation from the passage?',
            options: ['Candidates should focus equally on technical algorithms and verbal articulation', 'Keywords are the only thing that matters', 'Interviews are obsolete', 'ATS systems reject all resumes'],
            correctAnswer: 'Candidates should focus equally on technical algorithms and verbal articulation',
            explanation: 'The passage states candidates must develop a balanced skill set including algorithms and verbal articulation.'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, opt) => {
    if (submitted) return;
    setUserAnswers({ ...userAnswers, [qIdx]: opt });
  };

  const handleSubmitReading = async () => {
    if (submitted || submitting || !readingData) return;
    setSubmitting(true);

    try {
      const res = await API.post('/communication/reading/submit', {
        passage: readingData.passage,
        questions: readingData.questions,
        userAnswers
      });

      if (res.data.success) {
        setResult(res.data);
        setSubmitted(true);
        showToast(`Reading Quiz Score: ${res.data.score}/${res.data.totalQuestions}`, 'success');
      }
    } catch (err) {
      let score = 0;
      const evaluated = readingData.questions.map((q, idx) => {
        const uAns = userAnswers[idx] || '';
        const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        if (isCorrect) score++;
        return { question: q.question, userResponse: uAns, correctAnswer: q.correctAnswer, isCorrect, explanation: q.explanation };
      });
      setResult({ score, totalQuestions: readingData.questions.length, percentage: Math.round((score / readingData.questions.length) * 100), evaluatedDetails: evaluated });
      setSubmitted(true);
      showToast('Reading comprehension evaluated', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <BookOpenText className="w-8 h-8 text-emerald-400" />
          AI Reading Comprehension
        </h1>
        <p className="text-sm text-slate-400 mt-1">Read AI-generated corporate reading passages and answer inference, main idea, and vocabulary questions.</p>
      </div>

      {/* DIFFICULTY CONFIGURATOR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Passage Complexity:</span>
          <div className="flex gap-2">
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  difficulty === d 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGeneratePassage}
          disabled={loading}
          className="px-6 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-40"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {loading ? 'Generating AI Passage...' : `Generate New Reading Passage (${difficulty})`}
        </button>
      </div>

      {/* PASSAGE DISPLAY & QUIZ */}
      {readingData && (
        <div className="space-y-6">
          
          {/* Passage Container */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-black text-white">{readingData.title || 'Placement Reading Passage'}</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                {readingData.difficulty} Passage
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {readingData.passage}
            </div>
          </div>

          {/* Comprehension Questions */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Comprehension Questions (Strictly Based on Passage)
            </h3>

            {!submitted ? (
              <div className="space-y-6">
                {readingData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        <span className="text-emerald-400 font-bold mr-2">Q{qIdx + 1}.</span>
                        {q.question}
                      </p>
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-semibold">
                        {q.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(q.options || []).map((opt, oIdx) => {
                        const isSelected = userAnswers[qIdx] === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, opt)}
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
                ))}

                <button
                  onClick={handleSubmitReading}
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {submitting ? 'Submitting Answers...' : 'Submit Reading Comprehension Test'}
                </button>
              </div>
            ) : (
              /* RESULT DISPLAY */
              <div className="space-y-6 text-center">
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <h3 className="text-2xl font-black text-white">Reading Comprehension Score: {result.score} / {result.totalQuestions}</h3>
                  <p className="text-xs text-emerald-300 font-bold">Accuracy: {result.percentage}%</p>
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
                      <p className="text-slate-400 italic">Evidence: {detail.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
