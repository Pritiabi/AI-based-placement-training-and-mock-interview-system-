const Progress = require('../models/Progress');
const User = require('../models/User');
const Notification = require('../models/Notification');
const DailyChallenge = require('../models/DailyChallenge');
const { generateVocabulary, generateGrammarExercises, generateReadingPassage, generateCodingQuestions } = require('../services/geminiService');

const getUserProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        aptitudeScore: 72,
        codingScore: 65,
        interviewScore: 76,
        communicationScore: 78,
        resumeScore: 82,
        streak: user ? user.streak : 7,
        history: [
          { date: new Date(Date.now() - 6 * 86400000), aptitude: 60, coding: 50, interview: 65, communication: 70, resume: 75 },
          { date: new Date(Date.now() - 5 * 86400000), aptitude: 65, coding: 55, interview: 68, communication: 72, resume: 78 },
          { date: new Date(Date.now() - 4 * 86400000), aptitude: 68, coding: 58, interview: 70, communication: 74, resume: 80 },
          { date: new Date(Date.now() - 3 * 86400000), aptitude: 70, coding: 60, interview: 72, communication: 75, resume: 82 },
          { date: new Date(Date.now() - 2 * 86400000), aptitude: 72, coding: 62, interview: 74, communication: 76, resume: 82 },
          { date: new Date(Date.now() - 1 * 86400000), aptitude: 74, coding: 65, interview: 76, communication: 78, resume: 82 }
        ]
      });
    }

    res.status(200).json({
      success: true,
      progress,
      userStreak: user ? user.streak : progress.streak,
      todayGoalCompleted: user ? user.todayGoalCompleted : false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Date-Based Daily Challenge with persistent MongoDB record per day
const getDailyChallenge = async (req, res) => {
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    let challenge = await DailyChallenge.findOne({ userId: req.user._id, dateStr });

    if (!challenge) {
      // Generate components via Gemini AI engine
      const [aiVocab, aiGrammar, aiReading, aiCoding] = await Promise.all([
        generateVocabulary(5),
        generateGrammarExercises('Tenses', 'Medium', 5),
        generateReadingPassage('Medium'),
        generateCodingQuestions('Python', 'Medium', 'Arrays', 1)
      ]);

      challenge = await DailyChallenge.create({
        userId: req.user._id,
        dateStr,
        vocabulary: aiVocab,
        grammar: aiGrammar,
        reading: aiReading,
        coding: aiCoding[0] || {
          title: 'Find the Largest Element in Array',
          problemStatement: 'Given an array of integers, find and return the maximum element.',
          language: 'Python',
          difficulty: 'Medium',
          sampleInput: '[10, 25, 7, 40, 18]',
          sampleOutput: '40',
          solution: 'def find_largest(arr): return max(arr)',
          explanation: 'Iterate through array to find the maximum element.'
        },
        completedModules: {
          vocabulary: false,
          grammar: false,
          reading: false,
          coding: false
        },
        isFullyCompleted: false,
        totalScore: 0,
        xpEarned: 0
      });
    }

    res.status(200).json({ success: true, challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit individual Daily Challenge module completion
const submitDailyChallengeModule = async (req, res) => {
  try {
    const { moduleName, moduleScore = 100 } = req.body;
    const dateStr = new Date().toISOString().split('T')[0];

    let challenge = await DailyChallenge.findOne({ userId: req.user._id, dateStr });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Daily challenge not found for today.' });
    }

    if (moduleName && challenge.completedModules[moduleName] !== undefined) {
      challenge.completedModules[moduleName] = true;
      challenge.totalScore += Math.round(moduleScore / 4);
      challenge.xpEarned += 50;
    }

    // Check if all 4 modules are completed
    const allDone = challenge.completedModules.vocabulary &&
                    challenge.completedModules.grammar &&
                    challenge.completedModules.reading &&
                    challenge.completedModules.coding;

    if (allDone && !challenge.isFullyCompleted) {
      challenge.isFullyCompleted = true;
      challenge.xpEarned += 100; // Bonus XP

      const user = await User.findById(req.user._id);
      if (user) {
        user.todayGoalCompleted = true;
        user.streak += 1;
        user.lastActiveDate = new Date();
        await user.save();
      }

      await Notification.create({
        userId: req.user._id,
        title: 'Daily Placement Master Challenge Completed! 🔥',
        message: `Outstanding! You completed all 4 daily learning modules (Vocabulary, Grammar, Reading, and Coding) and earned 300 XP! Streak: ${user ? user.streak : 1} days!`,
        type: 'challenge'
      });
    }

    await challenge.save();

    res.status(200).json({
      success: true,
      challenge,
      isFullyCompleted: challenge.isFullyCompleted,
      xpEarned: challenge.xpEarned
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const completeDailyChallenge = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.todayGoalCompleted = true;
      user.streak += 1;
      user.lastActiveDate = new Date();
      await user.save();
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (progress) {
      progress.streak = user ? user.streak : progress.streak + 1;
      await progress.save();
    }

    await Notification.create({
      userId: req.user._id,
      title: 'Daily Challenge Completed! 🔥',
      message: `Awesome job! You completed today's placement preparation challenge and maintained your ${user.streak} day streak!`,
      type: 'challenge'
    });

    res.status(200).json({ success: true, streak: user ? user.streak : 8, todayGoalCompleted: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      notifications = [
        {
          _id: 'n1',
          title: 'Welcome to PlacePrep AI! 🚀',
          message: 'Get started by exploring study materials, generating AI quizzes, and building your ATS-friendly resume.',
          read: false,
          createdAt: new Date()
        },
        {
          _id: 'n2',
          title: "Today's Placement Challenge Ready! 🔥",
          message: 'Complete 5 aptitude questions and 2 coding problems to keep your streak active.',
          read: false,
          createdAt: new Date(Date.now() - 3600000)
        }
      ];
    }

    const unreadCount = notifications.filter(n => !n.read).length;
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== 'n1' && id !== 'n2') {
      await Notification.findByIdAndUpdate(id, { read: true });
    }
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getUserProgress, 
  getDailyChallenge, 
  submitDailyChallengeModule,
  completeDailyChallenge, 
  getNotifications, 
  markNotificationRead 
};
