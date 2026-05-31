const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '/images/sample.jpg',
    },
    cuisineType: {
      type: [String],
      default: [],
    },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'both'],
      default: 'veg',
    },
    address: {
      line1: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    openHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '21:00' },
    },
    deliverySlots: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
