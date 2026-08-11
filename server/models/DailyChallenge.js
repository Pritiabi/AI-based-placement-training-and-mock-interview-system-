const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateStr: { type: String, required: true }, // "YYYY-MM-DD"
  vocabulary: [{
    word: String,
    partOfSpeech: String,
    simpleMeaning: String,
    exampleSentence: String,
    synonym: String,
    antonym: String,
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  grammar: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  reading: {
    passage: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: String,
      explanation: String
    }]
  },
  coding: {
    title: String,
    problemStatement: String,
    language: String,
    difficulty: String,
    sampleInput: String,
    sampleOutput: String,
    solution: String,
    explanation: String
  },
  completedModules: {
    vocabulary: { type: Boolean, default: false },
    grammar: { type: Boolean, default: false },
    reading: { type: Boolean, default: false },
    coding: { type: Boolean, default: false }
  },
  isFullyCompleted: { type: Boolean, default: false },
  totalScore: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 }
}, { timestamps: true });

dailyChallengeSchema.index({ userId: 1, dateStr: 1 }, { unique: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
