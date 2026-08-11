const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'] 
  },
  topic: { type: String, required: true },
  title: { type: String, required: true },
  introduction: { type: String, required: true },
  concepts: [{ type: String }],
  formulas: [{ name: String, formula: String, description: String }],
  shortcuts: [{ type: String }],
  solvedExamples: [{
    question: String,
    solution: String,
    explanation: String
  }],
  commonMistakes: [{ type: String }],
  interviewTips: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
