const mongoose = require('mongoose');

const codingAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  difficulty: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'Coding'], required: true },
  topic: { type: String, default: 'General' },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  details: [{
    questionId: String,
    questionTitle: String,
    userResponse: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('CodingAttempt', codingAttemptSchema);
