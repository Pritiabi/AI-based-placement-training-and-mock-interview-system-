const CommunicationAttempt = require('../models/CommunicationAttempt');
const DailyVocabulary = require('../models/DailyVocabulary');
const GrammarExercise = require('../models/GrammarExercise');
const ReadingComprehension = require('../models/ReadingComprehension');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');
const { 
  evaluateSpeakingResponse, 
  generateVocabulary, 
  generateGrammarExercises, 
  generateReadingPassage 
} = require('../services/geminiService');

// Evaluate speaking attempt
const evaluateCommunication = async (req, res) => {
  try {
    const { topic, transcript } = req.body;

    if (!transcript || transcript.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Speech transcript is too short to evaluate.' });
    }

    const evaluation = await evaluateSpeakingResponse(topic || 'General Speaking', transcript);

    const attempt = await CommunicationAttempt.create({
      userId: req.user._id,
      topic: topic || 'General Speaking',
      transcript,
      scores: evaluation.scores,
      feedback: evaluation.feedback,
      suggestedCorrections: evaluation.suggestedCorrections || []
    });

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.communicationScore = Math.round((progress.communicationScore + evaluation.scores.overall) / (progress.communicationScore === 0 ? 1 : 2));
    await progress.save();

    res.status(200).json({ success: true, attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get speaking topics
const getSpeakingTopics = async (req, res) => {
  const topics = [
    { id: 1, title: 'Describe your final year college project architecture', category: 'Technical' },
    { id: 2, title: 'Why do you want to start your software engineering career with our company?', category: 'HR' },
    { id: 3, title: 'How do you handle deadline pressure and prioritization when tasks pile up?', category: 'Behavioral' },
    { id: 4, title: 'Explain a technical concept (e.g. REST APIs or Machine Learning) to a non-technical person', category: 'Communication' }
  ];
  res.status(200).json({ success: true, topics });
};

// Get past communication attempts
const getCommunicationHistory = async (req, res) => {
  try {
    const attempts = await CommunicationAttempt.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 1. Get Daily Vocabulary
const getDailyVocabulary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let vocabDocs = await DailyVocabulary.find({ dateStr: today });

    if (vocabDocs.length === 0) {
      const aiVocab = await generateVocabulary(5);
      vocabDocs = await Promise.all(
        aiVocab.map(v => DailyVocabulary.create({
          dateStr: today,
          word: v.word,
          partOfSpeech: v.partOfSpeech,
          simpleMeaning: v.simpleMeaning,
          exampleSentence: v.exampleSentence,
          synonym: v.synonym,
          antonym: v.antonym,
          difficulty: v.difficulty || 'Medium',
          interviewUsage: v.interviewUsage,
          quizQuestions: [{
            type: 'Synonym',
            question: v.question,
            options: v.options,
            correctAnswer: v.correctAnswer,
            explanation: v.explanation
          }]
        }))
      );
    }

    res.status(200).json({ success: true, vocabulary: vocabDocs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Vocabulary Quiz
const submitVocabularyQuiz = async (req, res) => {
  try {
    const { answers, vocabulary } = req.body;
    let score = 0;
    const evaluated = vocabulary.map((v, idx) => {
      const q = (v.quizQuestions && v.quizQuestions[0]) || { correctAnswer: v.synonym, explanation: `"${v.word}" means ${v.simpleMeaning}` };
      const uAns = answers[idx] || '';
      const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) score++;
      return {
        word: v.word,
        userResponse: uAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const total = vocabulary.length;
    const pct = Math.round((score / total) * 100);

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.communicationScore = Math.round((progress.communicationScore + pct) / (progress.communicationScore === 0 ? 1 : 2));
    await progress.save();

    res.status(200).json({
      success: true,
      score,
      totalQuestions: total,
      percentage: pct,
      evaluatedDetails: evaluated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Generate AI Grammar Exercises
const getGrammarExercises = async (req, res) => {
  try {
    const { topic = 'Tenses', difficulty = 'Medium', count = 5 } = req.body;
    const questions = await generateGrammarExercises(topic, difficulty, count);
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Grammar Quiz
const submitGrammarQuiz = async (req, res) => {
  try {
    const { topic, difficulty, questions, userAnswers } = req.body;
    let score = 0;

    const evaluated = questions.map((q, idx) => {
      const uAns = userAnswers[idx] || '';
      const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) score++;
      return {
        question: q.question,
        userResponse: uAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    await QuizAttempt.create({
      userId: req.user._id,
      quizType: 'Aptitude',
      topic: `Grammar - ${topic}`,
      difficulty,
      score,
      totalQuestions: total,
      percentage,
      accuracy: percentage
    });

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.verbalScore = Math.round((progress.verbalScore + percentage) / (progress.verbalScore === 0 ? 1 : 2));
    await progress.save();

    res.status(200).json({
      success: true,
      score,
      totalQuestions: total,
      percentage,
      evaluatedDetails: evaluated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Generate AI Reading Comprehension
const getReadingComprehension = async (req, res) => {
  try {
    const { difficulty = 'Medium' } = req.query;
    const data = await generateReadingPassage(difficulty);
    res.status(200).json({ success: true, reading: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit Reading Comprehension Quiz
const submitReadingQuiz = async (req, res) => {
  try {
    const { passage, questions, userAnswers } = req.body;
    let score = 0;

    const evaluated = questions.map((q, idx) => {
      const uAns = userAnswers[idx] || '';
      const isCorrect = uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) score++;
      return {
        question: q.question,
        type: q.type,
        userResponse: uAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    await QuizAttempt.create({
      userId: req.user._id,
      quizType: 'Aptitude',
      topic: 'Reading Comprehension',
      difficulty: 'Medium',
      score,
      totalQuestions: total,
      percentage,
      accuracy: percentage
    });

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.verbalScore = Math.round((progress.verbalScore + percentage) / (progress.verbalScore === 0 ? 1 : 2));
    await progress.save();

    res.status(200).json({
      success: true,
      score,
      totalQuestions: total,
      percentage,
      evaluatedDetails: evaluated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  evaluateCommunication, 
  getSpeakingTopics, 
  getCommunicationHistory,
  getDailyVocabulary,
  submitVocabularyQuiz,
  getGrammarExercises,
  submitGrammarQuiz,
  getReadingComprehension,
  submitReadingQuiz
};
