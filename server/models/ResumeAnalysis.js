const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  extractedText: { type: String, required: true },
  isResumeValid: { type: Boolean, default: true },
  atsScore: { type: Number, required: true },
  scoreBreakdown: {
    contactInfo: Number,
    summary: Number,
    education: Number,
    skills: Number,
    projects: Number,
    experience: Number,
    formatting: Number,
    actionVerbs: Number
  },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  missingSections: [{ type: String }],
  recommendations: [{ type: String }],
  jobMatchScore: { type: Number, default: 0 },
  jobMatchDetails: {
    matchingSkills: [String],
    missingSkills: [String],
    matchingKeywords: [String],
    missingKeywords: [String],
    suggestions: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
