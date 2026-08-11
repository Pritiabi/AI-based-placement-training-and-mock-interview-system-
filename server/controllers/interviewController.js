const InterviewSession = require('../models/InterviewSession');
const Progress = require('../models/Progress');
const { evaluateInterviewAnswer } = require('../services/geminiService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Start new interview session
const startInterview = async (req, res) => {
  try {
    const { jobRole = 'Software Developer', interviewType = 'Mixed', difficulty = 'Intermediate' } = req.body;

    const initialQuestions = [
      {
        questionId: 'q1',
        questionText: interviewType === 'HR' 
          ? 'Tell me about yourself, your background, and why you are interested in this placement opportunity.'
          : `Explain the fundamental architecture and core technical principles behind your favorite project related to ${jobRole}.`
      },
      {
        questionId: 'q2',
        questionText: interviewType === 'HR'
          ? 'Describe a situation where you encountered a major technical challenge or conflict in a team. How did you handle it?'
          : `What are the key trade-offs between different data structures or design patterns when building scalable applications for a ${jobRole}?`
      },
      {
        questionId: 'q3',
        questionText: interviewType === 'HR'
          ? 'Where do you see yourself in five years, and how does joining our company align with your career goals?'
          : `How do you diagnose, debug, and optimize performance bottlenecks in a high-concurrency production environment?`
      }
    ];

    const session = await InterviewSession.create({
      userId: req.user._id,
      jobRole,
      interviewType,
      difficulty,
      status: 'in_progress',
      questions: initialQuestions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        userAnswer: '',
        score: 0,
        feedback: ''
      }))
    });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Evaluate individual answer
const evaluateAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, userAnswer, audioTranscript } = req.body;
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const currentQ = session.questions[questionIndex];
    if (!currentQ) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const finalAnswer = userAnswer || audioTranscript || 'Candidate provided no answer.';

    // Gemini evaluation
    const evalResult = await evaluateInterviewAnswer(session.jobRole, currentQ.questionText, finalAnswer);

    currentQ.userAnswer = finalAnswer;
    currentQ.audioTranscript = audioTranscript || '';
    currentQ.score = evalResult.score;
    currentQ.feedback = evalResult.feedback;
    currentQ.breakdown = evalResult.breakdown || {
      technicalKnowledge: evalResult.score,
      communication: evalResult.score - 2,
      grammar: 88,
      relevance: evalResult.score + 2,
      confidence: 80
    };

    await session.save();

    res.status(200).json({
      success: true,
      evaluation: evalResult,
      questionIndex,
      isLastQuestion: questionIndex >= session.questions.length - 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Finalize interview report
const finishInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    const validQuestions = session.questions.filter(q => q.score > 0);
    const totalScoreSum = validQuestions.reduce((acc, q) => acc + q.score, 0);
    const overallScore = validQuestions.length > 0 ? Math.round(totalScoreSum / validQuestions.length) : 75;

    session.status = 'completed';
    session.overallScore = overallScore;
    session.categoryScores = {
      technicalKnowledge: overallScore,
      communication: Math.round(overallScore * 0.95),
      grammar: Math.round(overallScore * 0.98),
      relevance: Math.round(overallScore * 1.02 > 100 ? 100 : overallScore * 1.02),
      confidence: Math.round(overallScore * 0.92)
    };

    session.strengths = [
      'Good core domain understanding for ' + session.jobRole,
      'Clear articulation of problem-solving approach',
      'Positive professional tone and structure'
    ];

    session.improvements = [
      'Utilize the STAR method (Situation, Task, Action, Result) for behavioral questions',
      'Incorporate quantitative metrics when describing past project successes',
      'Elaborate further on architectural trade-offs'
    ];

    session.aiRecommendations = [
      'Practice 5 more technical coding problems under topic: Data Structures & System Design.',
      'Review HR question templates for company-specific behavioral expectations.',
      'Take a mock interview for advanced technical difficulty next week.'
    ];

    await session.save();

    // Update progress
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.interviewScore = Math.round((progress.interviewScore + overallScore) / (progress.interviewScore === 0 ? 1 : 2));
    await progress.save();

    res.status(200).json({ success: true, report: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user interview sessions
const getInterviewHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { startInterview, evaluateAnswer, finishInterview, getInterviewHistory };
