const asyncHandler = require('../middleware/asyncHandler.js');
const Coupon = require('../models/couponModel.js');
const Order = require('../models/orderModel.js');

// @desc    Get the coupon that will auto-apply for the current user (if any)
// @route   GET /api/coupons/applicable
// @access  Private
const getApplicableCoupon = asyncHandler(async (req, res) => {
  const previousOrder = await Order.findOne({ user: req.user._id });
  if (previousOrder) {
    return res.json({ code: null, discount: 0 });
  }

  const coupon = await Coupon.findOne({ code: 'WELCOME100', isActive: true });
  if (!coupon) return res.json({ code: null, discount: 0 });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.json({ code: null, discount: 0 });
  }

  res.json({ code: coupon.code, discount: 100 });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Get coupon by id
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    return res.json(coupon);
  }
  res.status(404);
  throw new Error('Coupon not found');
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minCartValue,
    firstTimeOnly,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;

  if (!code || discountValue === undefined) {
    res.status(400);
    throw new Error('code and discountValue are required');
  }

  const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (exists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  if (discountType === 'percent' && (discountValue < 0 || discountValue > 100)) {
    res.status(400);
    throw new Error('Percent discount must be between 0 and 100');
  }

  const coupon = new Coupon({
    code,
    description,
    discountType,
    discountValue,
    minCartValue,
    firstTimeOnly,
    expiresAt,
    usageLimit,
    isActive,
  });

  const created = await coupon.save();
  res.status(201).json(created);
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minCartValue,
    firstTimeOnly,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  if (code && code.toUpperCase().trim() !== coupon.code) {
    const clash = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (clash) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }
    coupon.code = code;
  }

  if (description !== undefined) coupon.description = description;
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minCartValue !== undefined) coupon.minCartValue = minCartValue;
  if (firstTimeOnly !== undefined) coupon.firstTimeOnly = firstTimeOnly;
  if (expiresAt !== undefined) coupon.expiresAt = expiresAt;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (isActive !== undefined) coupon.isActive = isActive;

  if (coupon.discountType === 'percent' && (coupon.discountValue < 0 || coupon.discountValue > 100)) {
    res.status(400);
    throw new Error('Percent discount must be between 0 and 100');
  }

  const updated = await coupon.save();
  res.json(updated);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await Coupon.deleteOne({ _id: coupon._id });
  res.json({ message: 'Coupon removed' });
});

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getApplicableCoupon,
};
