const express = require('express');
const router = express.Router();
const { getUsers, getQuestions, createQuestion, updateQuestion, deleteQuestion, generateAIQuestionAdmin, getAdminStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/users', getUsers);
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/questions/generate-ai', generateAIQuestionAdmin);
router.get('/stats', getAdminStats);

module.exports = router;
