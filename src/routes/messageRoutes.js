const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

// Public route - create message
router.post('/', createMessage);

// Admin routes - get, update, delete messages
router.get('/', protect, admin, getMessages);
router.patch('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
