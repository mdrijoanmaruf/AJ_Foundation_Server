const mongoose = require('mongoose');

const videoTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Video topic name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VideoTopic', videoTopicSchema);
