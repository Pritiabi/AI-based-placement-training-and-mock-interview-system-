const express = require('express');
const router = express.Router();
const { startInterview, evaluateAnswer, finishInterview, getInterviewHistory } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/finish', protect, finishInterview);
router.get('/history', protect, getInterviewHistory);

module.exports = router;
