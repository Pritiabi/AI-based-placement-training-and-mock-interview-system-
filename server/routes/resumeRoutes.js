const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  saveResume, 
  getResume, 
  enhanceResumeAI, 
  analyzeResumeFile, 
  analyzeJobMatch, 
  getResumeHistory,
  deleteResumeAnalysis 
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isPdf = ext === '.pdf' || file.mimetype === 'application/pdf';
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are supported. Please upload a valid PDF resume.'));
    }
  }
});

// Middleware wrapper for Multer error handling
const uploadMiddleware = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size exceeds the allowed 5MB limit.' });
      }
      return res.status(400).json({ success: false, message: err.message || 'Please upload a valid PDF resume.' });
    }
    next();
  });
};

router.post('/', protect, saveResume);
router.get('/', protect, getResume);
router.post('/enhance', protect, enhanceResumeAI);
router.post('/upload', protect, uploadMiddleware, analyzeResumeFile);
router.post('/analyze', protect, uploadMiddleware, analyzeResumeFile);
router.post('/job-match', protect, analyzeJobMatch);
router.get('/history', protect, getResumeHistory);
router.delete('/:id', protect, deleteResumeAnalysis);

module.exports = router;
