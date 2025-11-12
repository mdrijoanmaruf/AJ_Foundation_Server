const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryTopic',
    required: [true, 'Topic is required'],
  },
  title: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  thumbnailUrl: {
    type: String,
  },
  deleteUrl: {
    type: String,
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

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
