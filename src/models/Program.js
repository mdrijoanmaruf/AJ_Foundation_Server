const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'শিরোনাম প্রয়োজন'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'বিবরণ প্রয়োজন'],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, 'ছবি প্রয়োজন'],
    },
    youtubeLink: {
      type: String,
      trim: true,
    },
    objectives: {
      type: [String],
      default: [],
    },
    beneficiaries: {
      type: [String],
      default: [],
    },
    expenseCategories: {
      type: [String],
      default: [],
    },
    areas: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering and filtering
programSchema.index({ order: 1 });
programSchema.index({ isActive: 1, createdAt: -1 });

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
