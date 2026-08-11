const StudyMaterial = require('../models/StudyMaterial');

// Get all study materials or filter by category
const getMaterials = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const materials = await StudyMaterial.find(filter).sort({ topic: 1 });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single topic material strictly
const getMaterialByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const material = await StudyMaterial.findOne({ 
      topic: { $regex: new RegExp(`^${topic.replace(/-/g, ' ')}$`, 'i') } 
    });

    if (!material) {
      return res.status(404).json({ success: false, message: `Material for topic "${topic}" not found` });
    }

    res.status(200).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMaterials, getMaterialByTopic };
