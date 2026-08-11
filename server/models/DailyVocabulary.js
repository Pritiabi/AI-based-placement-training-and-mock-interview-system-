const mongoose = require('mongoose');

const dailyVocabularySchema = new mongoose.Schema({
  dateStr: { type: String, required: true }, // e.g. "2026-08-11"
  word: { type: String, required: true },
  partOfSpeech: { type: String, required: true },
  simpleMeaning: { type: String, required: true },
  exampleSentence: { type: String, required: true },
  synonym: { type: String, required: true },
  antonym: { type: String, required: true },
  difficulty: { type: String, enum: ['Basic', 'Medium', 'Hard'], default: 'Medium' },
  interviewUsage: { type: String, default: '' },
  quizQuestions: [{
    type: { type: String, enum: ['Meaning', 'Synonym', 'Antonym', 'Fill-in-the-blank'] },
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('DailyVocabulary', dailyVocabularySchema);
