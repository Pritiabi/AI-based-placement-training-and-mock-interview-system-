const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true, enum: ['Python', 'Java', 'C++', 'SQL'] },
  difficulty: { type: String, required: true, enum: ['Basic', 'Easy', 'Medium', 'Hard'] },
  category: { type: String, default: 'General' },
  topic: { type: String, required: true },
  problemStatement: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  explanation: { type: String, default: '' },
  solution: { type: String, default: '' },
  timeComplexity: { type: String, default: 'O(N)' },
  spaceComplexity: { type: String, default: 'O(1)' },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: Boolean
  }],
  starterCode: { type: String, default: '' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);
