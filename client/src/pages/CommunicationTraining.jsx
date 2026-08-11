import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, MicOff, Sparkles, CheckCircle2, BookOpen, Volume2, Send, RotateCcw } from 'lucide-react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function CommunicationTraining() {
  const { showToast } = useNotification();
  const [activeModule, setActiveModule] = useState('speaking'); // 'speaking' | 'vocab' | 'grammar' | 'reading'

  // Speaking state
  const [speakingTopic, setSpeakingTopic] = useState('Describe your final year college project architecture.');
  const [speechText, setSpeechText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setSpeechText(prev => prev ? prev + ' ' + text : text);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      showToast('Speech recognition unavailable. Please type your speech response.', 'info');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setSpeechText('');
      recognition.start();
      setIsRecording(true);
      showToast('Microphone recording started. Speak your response!', 'success');
    }
  };

  const handleEvaluateSpeaking = async () => {
    if (!speechText || speechText.trim().length < 5) {
      showToast('Please speak or type a speech response first.', 'error');
      return;
    }

    setEvaluating(true);
    try {
      const res = await API.post('/communication/evaluate', {
        topic: speakingTopic,
        transcript: speechText
      });

      if (res.data.success && res.data.attempt) {
        setEvaluationResult(res.data.attempt);
        showToast('AI Communication Analysis Completed!', 'success');
      }
    } catch (err) {
      showToast('Simulated local evaluation response', 'info');
      setEvaluationResult({
        scores: { grammar: 85, vocabulary: 80, fluency: 82, relevance: 88, confidence: 80, overall: 83 },
        feedback: 'Good delivery with clear focus on topic requirements. Focus on smoother transitions between main paragraphs.',
        suggestedCorrections: [
          { original: 'I am having experience in Python', correction: 'I have experience in Python', explanation: 'Use simple present tense for states of experience.' }
        ]
      });
    } finally {
      setEvaluating(false);
    }
  };

  const generateAITopic = () => {
    const topics = [
      'Describe your final year college project architecture.',
      'Why do you want to start your software engineering career with our company?',
      'How do you handle deadline pressure and prioritization when tasks pile up?',
      'Explain a technical concept (REST APIs or Machine Learning) to a non-technical person.',
      'Tell me about a time you worked in a cross-functional team under conflict.'
    ];
    const rand = topics[Math.floor(Math.random() * topics.length)];
    setSpeakingTopic(rand);
    setSpeechText('');
    setEvaluationResult(null);
    showToast('New AI Speaking Topic Generated!', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-pink-400" />
          AI Communication & Speaking Trainer
        </h1>
        <p className="text-sm text-slate-400 mt-1">Train your spoken English fluency, grammar, vocabulary, and confidence for placement interviews.</p>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'speaking', label: 'Speaking Practice' },
          { id: 'vocab', label: 'Daily Vocabulary' },
          { id: 'grammar', label: 'Grammar Exercises' },
          { id: 'reading', label: 'Reading Comprehension' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeModule === m.id
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* MODULE 1: SPEAKING PRACTICE */}
      {activeModule === 'speaking' && (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">AI Generated Topic</span>
              <button
                onClick={generateAITopic}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Generate New Topic
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              "{speakingTopic}"
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Speech Transcript</label>
                <button
                  onClick={toggleRecording}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' 
                      : 'bg-pink-600/20 border border-pink-500/30 text-pink-300 hover:bg-pink-600/40'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecording ? 'Recording (Click to Stop)' : 'Record Microphone'}
                </button>
              </div>

              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Speak into your microphone or type your speech response here..."
                rows={6}
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 leading-relaxed"
              />
            </div>

            <button
              onClick={handleEvaluateSpeaking}
              disabled={evaluating}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-600/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {evaluating ? 'Analyzing Speech with AI...' : 'Submit Speech for AI Evaluation'}
            </button>

          </div>

          {/* AI Feedback Report */}
          {evaluationResult && (
            <div className="glass-panel p-6 rounded-3xl border border-pink-500/30 space-y-6 bg-gradient-to-b from-pink-950/20 to-slate-950">
              
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  AI Communication Report
                </h4>
                <span className="text-2xl font-black text-white">Overall: {evaluationResult.scores?.overall || 83}%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Grammar</span>
                  <span className="font-bold text-emerald-400 text-base">{evaluationResult.scores?.grammar}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Vocabulary</span>
                  <span className="font-bold text-indigo-400 text-base">{evaluationResult.scores?.vocabulary}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Fluency</span>
                  <span className="font-bold text-violet-400 text-base">{evaluationResult.scores?.fluency}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Relevance</span>
                  <span className="font-bold text-amber-400 text-base">{evaluationResult.scores?.relevance}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Confidence</span>
                  <span className="font-bold text-pink-400 text-base">{evaluationResult.scores?.confidence}%</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 italic">{evaluationResult.feedback}</p>

              {evaluationResult.suggestedCorrections && evaluationResult.suggestedCorrections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Grammar & Syntax Enhancements</span>
                  {evaluationResult.suggestedCorrections.map((sc, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <p><span className="text-rose-400 font-bold">Original:</span> "{sc.original}"</p>
                      <p><span className="text-emerald-400 font-bold">Better:</span> "{sc.correction}"</p>
                      <p className="text-slate-400 italic">Explanation: {sc.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* MODULE 2: DAILY VOCABULARY */}
      {activeModule === 'vocab' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-xl font-extrabold text-white">Daily Corporate Vocabulary Booster</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { word: 'Articulation', pos: 'noun', def: 'The clear and effective expression of ideas in speech or writing.', ex: 'His articulation during the technical interview impressed the panel.' },
              { word: 'Pragmatic', pos: 'adjective', def: 'Dealing with things sensibly and realistically based on practical considerations.', ex: 'We adopted a pragmatic approach to meet the product launch deadline.' },
              { word: 'Consensus', pos: 'noun', def: 'A general agreement reached among a group of people.', ex: 'The engineering team reached a consensus on adopting React framework.' },
              { word: 'Resilient', pos: 'adjective', def: 'Able to withstand or recover quickly from difficult conditions.', ex: 'Demonstrating resilient problem-solving is key for SDE interviews.' }
            ].map((v, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{v.word}</span>
                  <span className="text-xs font-mono text-indigo-400 italic">{v.pos}</span>
                </div>
                <p className="text-xs text-slate-300">{v.def}</p>
                <p className="text-xs text-slate-500 italic">Example: "{v.ex}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3 & 4: GRAMMAR & READING */}
      {(activeModule === 'grammar' || activeModule === 'reading') && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-pink-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">
            {activeModule === 'grammar' ? 'Grammar Practice Exercises' : 'Reading Comprehension Passages'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Practice Placement English exercises in our study materials section or generate an AI verbal quiz!
          </p>
        </div>
      )}

    </div>
  );
}
