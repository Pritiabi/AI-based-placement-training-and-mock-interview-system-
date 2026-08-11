const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'] 
  },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  createdBy: { type: String, default: 'System' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
