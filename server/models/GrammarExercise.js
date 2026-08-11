const mongoose = require('mongoose');

const grammarExerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { 
    type: String, 
    required: true,
    enum: [
      'Tenses', 'Articles', 'Prepositions', 'Subject-Verb Agreement', 
      'Active and Passive Voice', 'Direct and Indirect Speech', 
      'Sentence Correction', 'Error Detection', 'Conjunctions', 
      'Pronouns', 'Adjectives', 'Adverbs'
    ] 
  },
  difficulty: { type: String, enum: ['Basic', 'Medium', 'Hard'], default: 'Medium' },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GrammarExercise', grammarExerciseSchema);
