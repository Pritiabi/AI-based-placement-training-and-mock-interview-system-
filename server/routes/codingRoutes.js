const express = require('express');
const router = express.Router();
const {
  getLanguages,
  getTopics,
  getCodingQuestions,
  getCodingQuestionById,
  getCodingMCQs,
  getCodingMCQById,
  submitMCQAttempt,
  submitCodingSolution,
  explainCodeSolution,
  getCodingProgress,
  getCodingHistory
} = require('../controllers/codingController');

const { protect } = require('../middleware/authMiddleware');

router.get('/languages', getLanguages);
router.get('/topics', getTopics);
router.get('/questions', getCodingQuestions);
router.get('/questions/:id', getCodingQuestionById);
router.get('/mcqs', getCodingMCQs);
router.get('/mcqs/:id', getCodingMCQById);

router.post('/submit-mcq', protect, submitMCQAttempt);
router.post('/submit', protect, submitCodingSolution);
router.post('/explain', explainCodeSolution);

router.get('/progress', protect, getCodingProgress);
router.get('/history', protect, getCodingHistory);

module.exports = router;
