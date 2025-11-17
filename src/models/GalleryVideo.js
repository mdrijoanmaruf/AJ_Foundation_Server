const mongoose = require('mongoose');

const galleryVideoSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoTopic',
    required: [true, 'Topic is required'],
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GalleryVideo', galleryVideoSchema);
