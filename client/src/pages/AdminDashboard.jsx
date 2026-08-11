import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, HelpCircle, Plus, Edit, Trash2, Sparkles, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingState from '../components/LoadingState';

export default function AdminDashboard() {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'users' | 'stats'
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ totalUsers: 1, totalQuestions: 3, totalCodingQuestions: 2, totalQuizAttempts: 1, totalInterviewSessions: 1 });
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Question Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'Medium',
    isPublished: true
  });

  const [generatingAI, setGeneratingAI] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, questionsRes] = await Promise.all([
        API.get('/admin/stats').catch(() => ({ data: { success: false } })),
        API.get('/admin/users').catch(() => ({ data: { success: false } })),
        API.get('/admin/questions').catch(() => ({ data: { success: false } }))
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (questionsRes.data.success) setQuestions(questionsRes.data.questions || []);
    } catch (err) {
      console.warn('Admin data loaded in local mode');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleGenerateAIQuestion = async () => {
    setGeneratingAI(true);
    try {
      const res = await API.post('/admin/questions/generate-ai', {
        topic: questionForm.topic || 'Percentages',
        category: questionForm.category || 'Quantitative Aptitude',
        difficulty: questionForm.difficulty || 'Medium'
      });

      if (res.data.success && res.data.draftQuestion) {
        const draft = res.data.draftQuestion;
        setQuestionForm({
          category: draft.category || 'Quantitative Aptitude',
          topic: draft.topic || 'Percentages',
          question: draft.question || '',
          options: draft.options || ['', '', '', ''],
          correctAnswer: draft.correctAnswer || '',
          explanation: draft.explanation || '',
          difficulty: draft.difficulty || 'Medium',
          isPublished: false // Unpublished draft for review!
        });
        showToast('AI Generated draft question! Review & Edit before publishing.', 'info');
      }
    } catch (err) {
      showToast('Error generating question via AI', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/questions/${editingId}`, questionForm);
        showToast('Question updated successfully!', 'success');
      } else {
        await API.post('/admin/questions', questionForm);
        showToast('New question published successfully!', 'success');
      }
      setShowFormModal(false);
      setEditingId(null);
      fetchAdminData();
    } catch (err) {
      showToast('Failed to save question', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await API.delete(`/admin/questions/${id}`);
      showToast('Question deleted', 'info');
      fetchAdminData();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleEditClick = (q) => {
    setEditingId(q._id);
    setQuestionForm({
      category: q.category,
      topic: q.topic,
      question: q.question,
      options: q.options || ['', '', '', ''],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      isPublished: q.isPublished !== undefined ? q.isPublished : true
    });
    setShowFormModal(true);
  };

  const openNewForm = () => {
    setEditingId(null);
    setQuestionForm({
      category: 'Quantitative Aptitude',
      topic: 'Percentages',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'Medium',
      isPublished: true
    });
    setShowFormModal(true);
  };

  if (loading) return <LoadingState message="Loading Admin Management Workspace..." />;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
            Admin Content & Platform Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">Role-protected system administration for question bank, AI drafts, and user analytics.</p>
        </div>

        <button
          onClick={openNewForm}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          Add / Review New Question
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Users</span>
          <p className="text-2xl font-black text-white">{stats.totalUsers || users.length}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Question Bank</span>
          <p className="text-2xl font-black text-indigo-400">{stats.totalQuestions || questions.length}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Quiz Attempts</span>
          <p className="text-2xl font-black text-emerald-400">{stats.totalQuizAttempts || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Mock Interviews</span>
          <p className="text-2xl font-black text-violet-400">{stats.totalInterviewSessions || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'questions' ? 'bg-indigo-600 text-white' : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          Questions Manager ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-indigo-600 text-white' : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {/* TAB 1: QUESTION MANAGER */}
      {activeTab === 'questions' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Question</th>
                  <th className="pb-3">Topic</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {questions.map((q) => (
                  <tr key={q._id}>
                    <td className="py-3 font-semibold text-white max-w-xs truncate">{q.question}</td>
                    <td className="py-3 text-slate-400">{q.topic}</td>
                    <td className="py-3 text-slate-400">{q.category}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                        q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3">
                      {q.isPublished ? (
                        <span className="text-emerald-400 font-bold">Published</span>
                      ) : (
                        <span className="text-amber-400 font-bold">Draft</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button onClick={() => handleEditClick(q)} className="p-1 text-indigo-400 hover:text-indigo-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q._id)} className="p-1 text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Candidate Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">College</th>
                  <th className="pb-3">Degree</th>
                  <th className="pb-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 text-slate-400">{u.email}</td>
                    <td className="py-3 text-slate-400">{u.college || 'Engineering College'}</td>
                    <td className="py-3">{u.degree} ({u.department})</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        u.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT / CREATE QUESTION MODAL WITH AI GENERATION */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Question' : 'Add / Review Question'}
              </h3>
              <button
                type="button"
                onClick={handleGenerateAIQuestion}
                disabled={generatingAI}
                className="px-3 py-1.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-600/40 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {generatingAI ? 'Generating AI Question...' : 'Generate with AI'}
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Verbal Ability">Verbal Ability</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Topic</label>
                  <input
                    type="text"
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    placeholder="Topic e.g. Percentages"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Question Text</label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="Enter clear placement question text..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300 block">Options A, B, C, D</label>
                {questionForm.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Correct Answer (Must match one option exactly)</label>
                <input
                  type="text"
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                  placeholder="Exact text of correct option"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Step-by-Step Explanation</label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Detailed solution steps..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={questionForm.isPublished}
                  onChange={(e) => setQuestionForm({ ...questionForm, isPublished: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-800"
                />
                <label htmlFor="pub" className="font-bold text-white">Publish Question to Active Bank</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
                >
                  {questionForm.isPublished ? 'Publish Question' : 'Save as Draft'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
