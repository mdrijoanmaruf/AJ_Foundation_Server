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
  // Video controllers
  createVideoTopic,
  getVideoTopics,
  deleteVideoTopic,
  uploadVideo,
  getVideosByTopic,
  getAllVideos,
  deleteVideo,
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

// Video topic routes
router.post('/video-topics', protect, admin, createVideoTopic);
router.get('/video-topics', getVideoTopics);
router.delete('/video-topics/:id', protect, admin, deleteVideoTopic);

// Video routes
router.post('/upload-video', protect, admin, uploadVideo);
router.get('/videos', getAllVideos);
router.get('/videos/:topicId', getVideosByTopic);
router.delete('/videos/:id', protect, admin, deleteVideo);

module.exports = router;
