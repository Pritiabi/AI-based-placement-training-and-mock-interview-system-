const mongoose = require('mongoose');

const codingMCQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctAnswer: { type: String, required: true }, // 'A', 'B', 'C', 'D' or option text
  explanation: { type: String, required: true },
  language: { type: String, required: true, enum: ['Python', 'Java', 'C++', 'SQL'] },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Basic', 'Medium', 'Hard'] },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CodingMCQ', codingMCQSchema);
