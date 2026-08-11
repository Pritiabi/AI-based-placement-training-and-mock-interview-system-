const express = require('express');
const router = express.Router();
const { getMaterials, getMaterialByTopic } = require('../controllers/materialController');

router.get('/', getMaterials);
router.get('/:topic', getMaterialByTopic);

module.exports = router;
