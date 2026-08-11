const express = require('express');
const router = express.Router();
const { 
  getUserProgress, 
  getDailyChallenge, 
  submitDailyChallengeModule,
  completeDailyChallenge, 
  getNotifications, 
  markNotificationRead 
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserProgress);
router.get('/daily-challenge', protect, getDailyChallenge);
router.post('/daily-challenge/submit-module', protect, submitDailyChallengeModule);
router.post('/daily-challenge/complete', protect, completeDailyChallenge);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
