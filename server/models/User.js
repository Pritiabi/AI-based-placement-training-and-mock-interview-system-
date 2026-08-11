const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  department: { type: String, default: '' },
  graduationYear: { type: Number, default: 2026 },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  streak: { type: Number, default: 1 },
  lastActiveDate: { type: Date, default: Date.now },
  todayGoalCompleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
