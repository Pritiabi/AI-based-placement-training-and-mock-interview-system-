const QuizAttempt = require('../models/QuizAttempt');
const Question = require('../models/Question');
const Progress = require('../models/Progress');
const { generateQuizQuestions } = require('../services/geminiService');

// Generate Quiz Questions
const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = 'Medium', count = 5, category = 'Quantitative Aptitude' } = req.body;
    
    // First try database existing published questions
    let dbQuestions = await Question.find({ topic, difficulty, isPublished: true }).limit(count);
    
    let questions = [];
    if (dbQuestions && dbQuestions.length >= count) {
      questions = dbQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic
      }));
    } else {
      // Generate via Gemini AI
      questions = await generateQuizQuestions(topic, difficulty, count);
    }

    res.status(200).json({
      success: true,
      topic,
      difficulty,
      category,
      totalQuestions: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Quiz and calculate scores
const submitQuiz = async (req, res) => {
  try {
    const { topic, category = 'Quantitative Aptitude', difficulty = 'Medium', userAnswers, questions, timeTakenSeconds = 0 } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'Invalid questions payload' });
    }

    let correctCount = 0;
    const evaluatedQuestions = questions.map((q, index) => {
      const uAns = userAnswers[index] || '';
      const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: uAns,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const accuracy = percentage;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      category,
      topic,
      difficulty,
      questions: evaluatedQuestions,
      score: correctCount,
      totalQuestions,
      percentage,
      accuracy,
      timeTakenSeconds
    });

    // Update User Progress
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = new Progress({ userId: req.user._id });
    }
    progress.aptitudeScore = Math.round((progress.aptitudeScore + percentage) / (progress.aptitudeScore === 0 ? 1 : 2));
    progress.history.push({
      date: new Date(),
      aptitude: percentage,
      coding: progress.codingScore,
      interview: progress.interviewScore,
      communication: progress.communicationScore,
      resume: progress.resumeScore
    });
    await progress.save();

    res.status(200).json({
      success: true,
      attemptId: attempt._id,
      score: correctCount,
      totalQuestions,
      percentage,
      accuracy,
      evaluatedQuestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user quiz attempts history
const getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateQuiz, submitQuiz, getQuizHistory };
