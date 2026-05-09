const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      enum: ['fixed', 'percent'],
      required: true,
      default: 'fixed',
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minCartValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    firstTimeOnly: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 = unlimited
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
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

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
