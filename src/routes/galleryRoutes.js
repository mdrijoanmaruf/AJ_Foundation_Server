const express = require('express');
const router = express.Router();
const {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  uploadImage,
  getImagesByTopic,
  getAllImages,
  deleteImage,
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/auth');

// Topic routes
router.post('/topics', protect, admin, createTopic);
router.get('/topics', getTopics);
router.put('/topics/:id', protect, admin, updateTopic);
router.delete('/topics/:id', protect, admin, deleteTopic);

// Image routes
router.post('/upload', protect, admin, uploadImage);
router.get('/images', getAllImages);
router.get('/images/:topicId', getImagesByTopic);
router.delete('/images/:id', protect, admin, deleteImage);

module.exports = router;
