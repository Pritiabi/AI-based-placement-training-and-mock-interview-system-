const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Progress = require('../models/Progress');
const { enhanceResumeContent, analyzeATSResume, matchJobDescription } = require('../services/geminiService');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// Save or Update Builder Resume Data
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    let resume = await Resume.findOne({ userId: req.user._id });

    if (resume) {
      Object.assign(resume, resumeData);
      resume.version += 1;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId: req.user._id,
        ...resumeData
      });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    res.status(200).json({ success: true, resume: resume || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Enhance Resume Content
const enhanceResumeAI = async (req, res) => {
  try {
    const resumeData = req.body;
    const enhanced = await enhanceResumeContent(resumeData);
    res.status(200).json({ success: true, enhancedResume: enhanced });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Strict Upload & Analyze Resume PDF
const analyzeResumeFile = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid PDF resume.' });
    }

    tempFilePath = req.file.path;
    const originalName = req.file.originalname || 'Resume.pdf';

    // 1. Strict File Type & Extension Validation (PDF Priority)
    const isPdfMime = req.file.mimetype === 'application/pdf';
    const isPdfExt = originalName.toLowerCase().endsWith('.pdf');

    if (!isPdfMime && !isPdfExt) {
      if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return res.status(400).json({ 
        success: false, 
        message: 'Only PDF resume files are supported. Please upload a valid PDF resume.' 
      });
    }

    // 2. Server-side PDF Text Extraction
    const fileBuffer = fs.readFileSync(tempFilePath);
    let extractedText = '';

    try {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text || '';
    } catch (parseErr) {
      console.error('[PDF Parse Error]', parseErr);
    }

    // Check for unreadable / scanned PDF
    if (!extractedText || extractedText.trim().length < 30) {
      if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return res.status(400).json({
        success: false,
        message: 'We could not extract readable text from this PDF. Please upload a text-based resume PDF.'
      });
    }

    // 3. Document Resume Verification (Verify it actually IS a resume)
    const lowerText = extractedText.toLowerCase();
    const resumeIndicators = [
      'education', 'skill', 'project', 'experience', 'intern', 
      'certification', 'summary', 'objective', 'contact', 'phone', 
      'email', 'degree', 'b.tech', 'university', 'college', 'curriculum vitae', 
      'resume', 'gpa', 'achievement'
    ];

    const matchedIndicators = resumeIndicators.filter(ind => lowerText.includes(ind));

    if (matchedIndicators.length < 2) {
      if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return res.status(400).json({
        success: false,
        message: 'This document does not appear to be a resume. Please upload a valid resume PDF.'
      });
    }

    // 4. Calculate Actual ATS Score & Recommendations
    const analysis = await analyzeATSResume(extractedText);

    // 5. Store Valid Resume Analysis Record in MongoDB
    const analysisRecord = await ResumeAnalysis.create({
      userId: req.user._id,
      fileName: originalName,
      extractedText,
      isResumeValid: true,
      atsScore: analysis.atsScore,
      scoreBreakdown: analysis.scoreBreakdown,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      missingSections: analysis.missingSections || [],
      recommendations: analysis.recommendations || []
    });

    // Update main Resume profile & candidate progress
    let resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) resume = new Resume({ userId: req.user._id });
    resume.fileName = originalName;
    resume.atsScore = analysis.atsScore;
    resume.atsBreakdown = analysis.scoreBreakdown;
    resume.atsStrengths = analysis.strengths;
    resume.atsImprovements = analysis.improvements;
    await resume.save();

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = new Progress({ userId: req.user._id });
    progress.resumeScore = analysis.atsScore;
    await progress.save();

    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    res.status(200).json({
      success: true,
      analysisId: analysisRecord._id,
      analysis: {
        fileName: originalName,
        atsScore: analysis.atsScore,
        scoreBreakdown: analysis.scoreBreakdown,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        missingSections: analysis.missingSections || [],
        recommendations: analysis.recommendations || [],
        extractedTextSnippet: extractedText.slice(0, 300) + '...'
      }
    });

  } catch (error) {
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Resume analysis is temporarily unavailable. Please try again.' 
    });
  }
};

// Compare Resume with Job Description
const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeText, jobDescription, analysisId } = req.body;
    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid job description.' });
    }

    let textToAnalyze = resumeText;
    if (!textToAnalyze && analysisId) {
      const record = await ResumeAnalysis.findById(analysisId);
      if (record) textToAnalyze = record.extractedText;
    }

    if (!textToAnalyze) {
      const resume = await Resume.findOne({ userId: req.user._id });
      textToAnalyze = resume ? (resume.fileName || 'Candidate Technical Skills') : 'Software Engineering Candidate';
    }

    const result = await matchJobDescription(textToAnalyze, jobDescription);

    if (analysisId) {
      await ResumeAnalysis.findByIdAndUpdate(analysisId, {
        jobMatchScore: result.jobMatchScore,
        jobMatchDetails: {
          matchingSkills: result.matchingSkills,
          missingSkills: result.missingSkills,
          matchingKeywords: result.matchingKeywords,
          missingKeywords: result.missingKeywords,
          suggestions: result.suggestions || result.recommendedChanges
        }
      });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Resume History from MongoDB
const getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Resume Analysis Record
const deleteResumeAnalysis = async (req, res) => {
  try {
    const record = await ResumeAnalysis.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Resume analysis record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveResume,
  getResume,
  enhanceResumeAI,
  analyzeResumeFile,
  analyzeJobMatch,
  getResumeHistory,
  deleteResumeAnalysis
};
