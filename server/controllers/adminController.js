const User = require('../models/User');
const Question = require('../models/Question');
const CodingQuestion = require('../models/CodingQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const InterviewSession = require('../models/InterviewSession');
const { generateQuizQuestions } = require('../services/geminiService');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { category, topic, question, options, correctAnswer, explanation, difficulty, isPublished = true } = req.body;
    const newQ = await Question.create({
      category,
      topic,
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      createdBy: req.user.name || 'Admin',
      isPublished
    });
    res.status(201).json({ success: true, question: newQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    res.status(200).json({ success: true, question: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate AI Question for Admin Review & Approval
const generateAIQuestionAdmin = async (req, res) => {
  try {
    const { topic = 'Percentages', difficulty = 'Medium', category = 'Quantitative Aptitude' } = req.body;
    const aiQuestions = await generateQuizQuestions(topic, difficulty, 1);
    if (aiQuestions && aiQuestions.length > 0) {
      const generated = aiQuestions[0];
      return res.status(200).json({
        success: true,
        draftQuestion: {
          category,
          topic: generated.topic || topic,
          question: generated.question,
          options: generated.options,
          correctAnswer: generated.correctAnswer,
          explanation: generated.explanation,
          difficulty: generated.difficulty || difficulty,
          isPublished: false // Unpublished draft for admin review!
        }
      });
    }
    res.status(500).json({ success: false, message: 'Failed to generate question with AI' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalCodingQuestions = await CodingQuestion.countDocuments();
    const totalQuizAttempts = await QuizAttempt.countDocuments();
    const totalInterviewSessions = await InterviewSession.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalQuestions,
        totalCodingQuestions,
        totalQuizAttempts,
        totalInterviewSessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getQuestions, createQuestion, updateQuestion, deleteQuestion, generateAIQuestionAdmin, getAdminStats };
