const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'manager','seller'],
    default: 'buyer',
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: 'https://example.com/default-profile.png', // Placeholder URL for profile photo
  },
  resetPasswordToken: { type: String },
resetPasswordExpire: { type: Date },

  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
