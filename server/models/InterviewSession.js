const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole: { type: String, required: true },
  interviewType: { type: String, enum: ['HR', 'Technical', 'Mixed'], default: 'Mixed' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  questions: [{
    questionId: String,
    questionText: String,
    userAnswer: String,
    audioTranscript: String,
    score: Number,
    feedback: String,
    breakdown: {
      technicalKnowledge: Number,
      communication: Number,
      grammar: Number,
      relevance: Number,
      confidence: Number
    }
  }],
  overallScore: { type: Number, default: 0 },
  categoryScores: {
    technicalKnowledge: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  aiRecommendations: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
