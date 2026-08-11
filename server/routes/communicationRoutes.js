const express = require('express');
const router = express.Router();
const { 
  evaluateCommunication, 
  getSpeakingTopics, 
  getCommunicationHistory,
  getDailyVocabulary,
  submitVocabularyQuiz,
  getGrammarExercises,
  submitGrammarQuiz,
  getReadingComprehension,
  submitReadingQuiz
} = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/evaluate', protect, evaluateCommunication);
router.get('/topics', getSpeakingTopics);
router.get('/history', protect, getCommunicationHistory);

// Vocabulary
router.get('/vocabulary', getDailyVocabulary);
router.post('/vocabulary/submit', protect, submitVocabularyQuiz);

// Grammar
router.post('/grammar/generate', getGrammarExercises);
router.post('/grammar/submit', protect, submitGrammarQuiz);

// Reading Comprehension
router.get('/reading', getReadingComprehension);
router.post('/reading/submit', protect, submitReadingQuiz);

module.exports = router;
