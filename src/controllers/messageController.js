const Message = require('../models/Message');

// @desc    Create new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create message
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/messages/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error while updating message' });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error while deleting message' });
  }
};

// @desc    Delete all messages
// @route   DELETE /api/messages
// @access  Private/Admin
const deleteAllMessages = async (req, res) => {
  try {
    await Message.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All messages deleted successfully',
    });
  } catch (error) {
    console.error('Delete all messages error:', error);
    res.status(500).json({ message: 'Server error while deleting messages' });
  }
};

// @desc    Delete all read messages
// @route   DELETE /api/messages/read
// @access  Private/Admin
const deleteReadMessages = async (req, res) => {
  try {
    await Message.deleteMany({ isRead: true });

    res.status(200).json({
      success: true,
      message: 'All read messages deleted successfully',
    });
  } catch (error) {
    console.error('Delete read messages error:', error);
    res.status(500).json({ message: 'Server error while deleting read messages' });
  }
};

// @desc    Delete all unread messages
// @route   DELETE /api/messages/unread
// @access  Private/Admin
const deleteUnreadMessages = async (req, res) => {
  try {
    await Message.deleteMany({ isRead: { $ne: true } });

    res.status(200).json({
      success: true,
      message: 'All unread messages deleted successfully',
    });
  } catch (error) {
    console.error('Delete unread messages error:', error);
    res.status(500).json({ message: 'Server error while deleting unread messages' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  deleteAllMessages,
  deleteReadMessages,
  deleteUnreadMessages,
};
