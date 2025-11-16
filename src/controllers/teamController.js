const Team = require('../models/Team');
const FormData = require('form-data');
const axios = require('axios');

// Upload image to ImgBB
const uploadToImgBB = async (base64Image) => {
  try {
    if (!process.env.IMGBB_API_KEY) {
      throw new Error('IMGBB_API_KEY not configured');
    }

    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (!response.data || !response.data.data || !response.data.data.url) {
      throw new Error('Invalid ImgBB response');
    }

    return response.data.data.url;
  } catch (error) {
    console.error('ImgBB upload error:', error.message);
    throw new Error('ছবি আপলোড ব্যর্থ হয়েছে');
  }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'টিম সদস্য পাওয়া যায়নি',
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private/Admin
exports.createTeamMember = async (req, res) => {
  try {
    const { name, designation, photo, email, phone, bio, order } = req.body;

    // Upload photo to ImgBB if it's a base64 string
    let photoUrl = photo;
    if (photo && photo.startsWith('data:image')) {
      try {
        photoUrl = await uploadToImgBB(photo);
      } catch (uploadError) {
        console.error('ImgBB upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'ছবি আপলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        });
      }
    }

    const teamMember = await Team.create({
      name,
      designation,
      photo: photoUrl,
      email,
      phone,
      bio,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'টিম সদস্য সফলভাবে যোগ করা হয়েছে',
      data: teamMember,
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'টিম সদস্য যোগ করতে ব্যর্থ হয়েছে',
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, designation, photo, email, phone, bio, order, isActive } = req.body;

    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'টিম সদস্য পাওয়া যায়নি',
      });
    }

    // Upload new photo if provided
    let photoUrl = photo;
    if (photo && photo.startsWith('data:image')) {
      photoUrl = await uploadToImgBB(photo);
    }

    teamMember.name = name || teamMember.name;
    teamMember.designation = designation || teamMember.designation;
    teamMember.photo = photoUrl || teamMember.photo;
    teamMember.email = email !== undefined ? email : teamMember.email;
    teamMember.phone = phone !== undefined ? phone : teamMember.phone;
    teamMember.bio = bio !== undefined ? bio : teamMember.bio;
    teamMember.order = order !== undefined ? order : teamMember.order;
    teamMember.isActive = isActive !== undefined ? isActive : teamMember.isActive;

    const updatedTeamMember = await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'টিম সদস্য সফলভাবে আপডেট করা হয়েছে',
      data: updatedTeamMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'টিম সদস্য পাওয়া যায়নি',
      });
    }

    await teamMember.deleteOne();

    res.status(200).json({
      success: true,
      message: 'টিম সদস্য সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
