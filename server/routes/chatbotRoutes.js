const express = require('express');
const router = express.Router();
const { chatWithOllama } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// @route   POST /api/chatbot
// @desc    Process a medical chat query with Ollama Stream
// @access  Patient (Protected)
router.post('/', protect, chatWithOllama);

module.exports = router;
