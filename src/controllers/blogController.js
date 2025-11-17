const Blog = require('../models/Blog');

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const { title, description, videoUrl, images } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and description are required' 
      });
    }

    const blog = new Blog({
      title,
      description,
      videoUrl: videoUrl || null,
      images: images || [],
      author: req.user.id,
    });

    await blog.save();

    // Populate author details
    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating blog',
      error: error.message 
    });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const { status, limit, page } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: blogs,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching blogs' 
    });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching blog' 
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const { title, description, videoUrl, images, status } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (videoUrl !== undefined) blog.videoUrl = videoUrl;
    if (images) blog.images = images;
    if (status) blog.status = status;

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating blog' 
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting blog' 
    });
  }
};

// @desc    Toggle blog status (draft/published)
// @route   PATCH /api/blogs/:id/status
// @access  Private/Admin
const toggleBlogStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    blog.status = blog.status === 'published' ? 'draft' : 'published';
    await blog.save();
    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: `Blog status changed to ${blog.status}`,
      data: blog,
    });
  } catch (error) {
    console.error('Toggle blog status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating blog status' 
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
};
