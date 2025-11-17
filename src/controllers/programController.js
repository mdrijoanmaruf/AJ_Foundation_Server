const Program = require('../models/Program');
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

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'প্রোগ্রাম পাওয়া যায়নি',
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create program
// @route   POST /api/programs
// @access  Private/Admin
exports.createProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      photo,
      youtubeLink,
      objectives,
      beneficiaries,
      expenseCategories,
      areas,
      duration,
      amount,
      galleryImages,
      order,
    } = req.body;

    // Upload main photo to ImgBB if it's a base64 string
    let photoUrl = photo;
    if (photo && photo.startsWith('data:image')) {
      try {
        photoUrl = await uploadToImgBB(photo);
      } catch (uploadError) {
        console.error('Main photo upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'ছবি আপলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        });
      }
    }

    // Upload gallery images if provided
    let galleryUrls = [];
    if (galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0) {
      for (const image of galleryImages) {
        if (image && image.startsWith('data:image')) {
          try {
            const url = await uploadToImgBB(image);
            galleryUrls.push(url);
          } catch (uploadError) {
            console.error('Gallery image upload error:', uploadError);
            // Continue with other images even if one fails
          }
        } else if (image) {
          galleryUrls.push(image);
        }
      }
    }

    const program = await Program.create({
      title,
      description,
      photo: photoUrl,
      youtubeLink,
      objectives: Array.isArray(objectives) ? objectives : [],
      beneficiaries: Array.isArray(beneficiaries) ? beneficiaries : [],
      expenseCategories: Array.isArray(expenseCategories) ? expenseCategories : [],
      areas: Array.isArray(areas) ? areas : [],
      duration,
      amount,
      galleryImages: galleryUrls,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: 'প্রোগ্রাম সফলভাবে যোগ করা হয়েছে',
      data: program,
    });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'প্রোগ্রাম যোগ করতে ব্যর্থ হয়েছে',
    });
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private/Admin
exports.updateProgram = async (req, res) => {
  try {
    const {
      title,
      description,
      photo,
      youtubeLink,
      objectives,
      beneficiaries,
      expenseCategories,
      areas,
      duration,
      amount,
      galleryImages,
      order,
      isActive,
    } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'প্রোগ্রাম পাওয়া যায়নি',
      });
    }

    // Upload new main photo if provided
    let photoUrl = photo;
    if (photo && photo.startsWith('data:image')) {
      try {
        photoUrl = await uploadToImgBB(photo);
      } catch (uploadError) {
        console.error('Main photo upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'ছবি আপলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        });
      }
    }

    // Upload new gallery images if provided
    let galleryUrls = program.galleryImages || [];
    if (galleryImages && Array.isArray(galleryImages)) {
      galleryUrls = [];
      for (const image of galleryImages) {
        if (image && image.startsWith('data:image')) {
          try {
            const url = await uploadToImgBB(image);
            galleryUrls.push(url);
          } catch (uploadError) {
            console.error('Gallery image upload error:', uploadError);
          }
        } else if (image) {
          galleryUrls.push(image);
        }
      }
    }

    program.title = title || program.title;
    program.description = description || program.description;
    program.photo = photoUrl || program.photo;
    program.youtubeLink = youtubeLink !== undefined ? youtubeLink : program.youtubeLink;
    program.objectives = objectives !== undefined ? objectives : program.objectives;
    program.beneficiaries = beneficiaries !== undefined ? beneficiaries : program.beneficiaries;
    program.expenseCategories = expenseCategories !== undefined ? expenseCategories : program.expenseCategories;
    program.areas = areas !== undefined ? areas : program.areas;
    program.duration = duration !== undefined ? duration : program.duration;
    program.amount = amount !== undefined ? amount : program.amount;
    program.galleryImages = galleryUrls;
    program.order = order !== undefined ? order : program.order;
    program.isActive = isActive !== undefined ? isActive : program.isActive;

    const updatedProgram = await program.save();

    res.status(200).json({
      success: true,
      message: 'প্রোগ্রাম সফলভাবে আপডেট করা হয়েছে',
      data: updatedProgram,
    });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'প্রোগ্রাম আপডেট করতে ব্যর্থ হয়েছে',
    });
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'প্রোগ্রাম পাওয়া যায়নি',
      });
    }

    await program.deleteOne();

    res.status(200).json({
      success: true,
      message: 'প্রোগ্রাম সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'প্রোগ্রাম মুছতে ব্যর্থ হয়েছে',
    });
  }
};
