const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
    explanation: String
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
