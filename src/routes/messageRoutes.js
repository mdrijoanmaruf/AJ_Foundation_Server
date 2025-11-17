const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  deleteAllMessages,
  deleteReadMessages,
  deleteUnreadMessages,
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

// Public route - create message
router.post('/', createMessage);

// Admin routes - get, update, delete messages
router.get('/', protect, admin, getMessages);
router.patch('/:id/read', protect, admin, markAsRead);
// Delete all messages
router.delete('/', protect, admin, deleteAllMessages);
// Delete all read messages
router.delete('/read', protect, admin, deleteReadMessages);
// Delete all unread messages
router.delete('/unread', protect, admin, deleteUnreadMessages);
// Delete single message by id (must be after specific routes)
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
