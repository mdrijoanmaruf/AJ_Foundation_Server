const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'নাম প্রয়োজন'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'পদবী প্রয়োজন'],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, 'ছবি প্রয়োজন'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering
teamSchema.index({ order: 1 });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
