const mongoose = require('mongoose');

const readingComprehensionSchema = new mongoose.Schema({
  title: { type: String, default: 'Placement Reading Passage' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  passage: { type: String, required: true },
  questions: [{
    type: { 
      type: String, 
      enum: ['Main idea', 'Inference', 'Vocabulary in context', 'Specific information', "Author's purpose"] 
    },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ReadingComprehension', readingComprehensionSchema);
