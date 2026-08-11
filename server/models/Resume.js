const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Placement Resume' },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  education: [{
    college: String,
    degree: String,
    department: String,
    cgpa: String,
    graduationYear: String
  }],
  skills: {
    programming: [String],
    technical: [String],
    softSkills: [String]
  },
  projects: [{
    name: String,
    description: String,
    technologies: String,
    role: String,
    link: String
  }],
  experience: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  certifications: [{
    name: String,
    organization: String,
    date: String
  }],
  achievements: [String],
  languages: [String],
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },
  atsScore: { type: Number, default: 0 },
  atsBreakdown: {
    keywords: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 }
  },
  atsStrengths: [String],
  atsImprovements: [String],
  jobMatchScore: { type: Number, default: 0 },
  jobMatchAnalysis: {
    matchingSkills: [String],
    missingSkills: [String],
    matchingKeywords: [String],
    missingKeywords: [String],
    recommendedChanges: [String]
  },
  version: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
