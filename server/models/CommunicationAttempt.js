const mongoose = require('mongoose');

const communicationAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  transcript: { type: String, required: true },
  scores: {
    grammar: { type: Number, required: true },
    vocabulary: { type: Number, required: true },
    fluency: { type: Number, required: true },
    relevance: { type: Number, required: true },
    confidence: { type: Number, required: true },
    overall: { type: Number, required: true }
  },
  feedback: { type: String, required: true },
  suggestedCorrections: [{ original: String, correction: String, explanation: String }]
}, { timestamps: true });

module.exports = mongoose.model('CommunicationAttempt', communicationAttemptSchema);
