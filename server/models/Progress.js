const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  aptitudeScore: { type: Number, default: 0 },
  codingScore: { type: Number, default: 0 },
  interviewScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  resumeScore: { type: Number, default: 0 },
  streak: { type: Number, default: 1 },
  lastChallengeDate: { type: Date },
  history: [{
    date: { type: Date, default: Date.now },
    aptitude: Number,
    coding: Number,
    interview: Number,
    communication: Number,
    resume: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
