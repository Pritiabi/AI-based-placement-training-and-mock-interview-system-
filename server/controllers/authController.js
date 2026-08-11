const User = require('../models/User');

// Register / sync profile
const syncUserProfile = async (req, res) => {
  try {
    const { firebaseUid, email, name, college, degree, department, graduationYear, profileImage } = req.body;
    let user = await User.findOne({ firebaseUid });

    if (user) {
      user.name = name || user.name;
      user.college = college !== undefined ? college : user.college;
      user.degree = degree !== undefined ? degree : user.degree;
      user.department = department !== undefined ? department : user.department;
      user.graduationYear = graduationYear || user.graduationYear;
      user.profileImage = profileImage !== undefined ? profileImage : user.profileImage;
      user.lastActiveDate = new Date();
      await user.save();
    } else {
      user = await User.create({
        firebaseUid,
        email,
        name,
        college,
        degree,
        department,
        graduationYear: graduationYear || 2026,
        profileImage,
        role: email === 'admin@placeprep.ai' ? 'admin' : 'user'
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, college, degree, department, graduationYear, profileImage } = req.body;
    if (name) user.name = name;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (department !== undefined) user.department = department;
    if (graduationYear) user.graduationYear = graduationYear;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { syncUserProfile, getUserProfile, updateUserProfile };
