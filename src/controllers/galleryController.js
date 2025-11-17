const GalleryTopic = require('../models/GalleryTopic');
const GalleryImage = require('../models/GalleryImage');
const VideoTopic = require('../models/VideoTopic');
const GalleryVideo = require('../models/GalleryVideo');
const FormData = require('form-data');
const fetch = require('node-fetch');

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || 'c3de21f44bd6973666f3daf550420de8';

// @desc    Create gallery topic
// @route   POST /api/gallery/topics
// @access  Private/Admin
const createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }

    const topic = new GalleryTopic({
      name,
      description,
    });

    await topic.save();

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: topic,
    });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Server error while creating topic' });
  }
};

// @desc    Get all topics
// @route   GET /api/gallery/topics
// @access  Public
const getTopics = async (req, res) => {
  try {
    const topics = await GalleryTopic.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Server error while fetching topics' });
  }
};

// @desc    Update topic
// @route   PUT /api/gallery/topics/:id
// @access  Private/Admin
const updateTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    const topic = await GalleryTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (name) topic.name = name;
    if (description !== undefined) topic.description = description;

    await topic.save();

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: topic,
    });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ message: 'Server error while updating topic' });
  }
};

// @desc    Delete topic
// @route   DELETE /api/gallery/topics/:id
// @access  Private/Admin
const deleteTopic = async (req, res) => {
  try {
    const topic = await GalleryTopic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Delete all images in this topic
    await GalleryImage.deleteMany({ topic: req.params.id });

    await topic.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Topic and all images deleted successfully',
    });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ message: 'Server error while deleting topic' });
  }
};

// @desc    Upload image to ImgBB
// @route   POST /api/gallery/upload
// @access  Private/Admin
const uploadImage = async (req, res) => {
  try {
    const { topicId, title, image } = req.body;

    if (!topicId || !image) {
      return res.status(400).json({ message: 'Topic and image are required' });
    }

    // Verify topic exists
    const topic = await GalleryTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Extract base64 data from data URL
    let base64Data = image;
    if (image.includes(',')) {
      base64Data = image.split(',')[1];
    }

    // Upload to ImgBB
    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders ? formData.getHeaders() : {},
    });

    const data = await response.json();

    if (!data.success) {
      console.error('ImgBB error:', data);
      throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
    }

    // Save to database
    const galleryImage = new GalleryImage({
      topic: topicId,
      title: title || '',
      imageUrl: data.data.url,
      thumbnailUrl: data.data.thumb.url,
      deleteUrl: data.data.delete_url,
      uploadedBy: req.user._id,
    });

    await galleryImage.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: galleryImage,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error while uploading image',
      error: error.toString()
    });
  }
};

// @desc    Get images by topic
// @route   GET /api/gallery/images/:topicId
// @access  Public
const getImagesByTopic = async (req, res) => {
  try {
    const images = await GalleryImage.find({ topic: req.params.topicId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Server error while fetching images' });
  }
};

// @desc    Get all images
// @route   GET /api/gallery/images
// @access  Public
const getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.find({})
      .sort({ createdAt: -1 })
      .populate('topic', 'name')
      .populate('uploadedBy', 'name');

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({ message: 'Server error while fetching images' });
  }
};

// @desc    Delete image
// @route   DELETE /api/gallery/images/:id
// @access  Private/Admin
const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error while deleting image' });
  }
};

// ============= VIDEO CONTROLLERS =============

// @desc    Create video topic
// @route   POST /api/gallery/video-topics
// @access  Private/Admin
const createVideoTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Video topic name is required' });
    }

    const videoTopic = new VideoTopic({
      name,
      description,
    });

    await videoTopic.save();

    res.status(201).json({
      success: true,
      message: 'Video topic created successfully',
      data: videoTopic,
    });
  } catch (error) {
    console.error('Create video topic error:', error);
    res.status(500).json({ message: 'Server error while creating video topic' });
  }
};

// @desc    Get all video topics
// @route   GET /api/gallery/video-topics
// @access  Public
const getVideoTopics = async (req, res) => {
  try {
    const videoTopics = await VideoTopic.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videoTopics.length,
      data: videoTopics,
    });
  } catch (error) {
    console.error('Get video topics error:', error);
    res.status(500).json({ message: 'Server error while fetching video topics' });
  }
};

// @desc    Delete video topic
// @route   DELETE /api/gallery/video-topics/:id
// @access  Private/Admin
const deleteVideoTopic = async (req, res) => {
  try {
    const videoTopic = await VideoTopic.findById(req.params.id);

    if (!videoTopic) {
      return res.status(404).json({ message: 'Video topic not found' });
    }

    // Delete all videos in this topic
    await GalleryVideo.deleteMany({ topic: req.params.id });

    await videoTopic.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Video topic and all videos deleted successfully',
    });
  } catch (error) {
    console.error('Delete video topic error:', error);
    res.status(500).json({ message: 'Server error while deleting video topic' });
  }
};

// @desc    Upload video (YouTube URL)
// @route   POST /api/gallery/upload-video
// @access  Private/Admin
const uploadVideo = async (req, res) => {
  try {
    const { topicId, title, videoUrl } = req.body;

    if (!topicId || !title || !videoUrl) {
      return res.status(400).json({ message: 'Topic, title, and video URL are required' });
    }

    // Verify topic exists
    const topic = await VideoTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Video topic not found' });
    }

    // Validate YouTube URL
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(youtubeRegex);
    if (!match || match[2].length !== 11) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    // Save to database
    const galleryVideo = new GalleryVideo({
      topic: topicId,
      title,
      videoUrl,
      uploadedBy: req.user._id,
    });

    await galleryVideo.save();

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: galleryVideo,
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error while uploading video',
      error: error.toString()
    });
  }
};

// @desc    Get videos by topic
// @route   GET /api/gallery/videos/:topicId
// @access  Public
const getVideosByTopic = async (req, res) => {
  try {
    const videos = await GalleryVideo.find({ topic: req.params.topicId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name');

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

// @desc    Get all videos
// @route   GET /api/gallery/videos
// @access  Public
const getAllVideos = async (req, res) => {
  try {
    const videos = await GalleryVideo.find({})
      .sort({ createdAt: -1 })
      .populate('topic', 'name')
      .populate('uploadedBy', 'name');

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

// @desc    Delete video
// @route   DELETE /api/gallery/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res) => {
  try {
    const video = await GalleryVideo.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error while deleting video' });
  }
};

module.exports = {
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
};
