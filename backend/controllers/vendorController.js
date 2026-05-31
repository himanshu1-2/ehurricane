const asyncHandler = require('../middleware/asyncHandler.js');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/userModel.js');
const Vendor = require('../models/vendorModel.js');

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const buildUniqueSlug = async (base) => {
  let slug = slugify(base) || `vendor-${Date.now()}`;
  let suffix = 0;
  while (await Vendor.findOne({ slug })) {
    suffix += 1;
    slug = `${slugify(base)}-${suffix}`;
  }
  return slug;
};

// @desc    Register a new vendor (creates User + Vendor profile)
// @route   POST /api/vendors/register
// @access  Public
const registerVendor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    shopName,
    description,
    cuisineType,
    foodType,
    address,
    contact,
    openHours,
    fcmToken,
  } = req.body;

  if (!name || !email || !password || !shopName) {
    res.status(400);
    throw new Error('name, email, password and shopName are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'vendor',
    fcmToken,
  });

  const slug = await buildUniqueSlug(shopName);

  const vendor = await Vendor.create({
    user: user._id,
    shopName,
    slug,
    description,
    cuisineType: Array.isArray(cuisineType) ? cuisineType : [],
    foodType: foodType || 'veg',
    address: address || {},
    contact: contact || { email },
    openHours: openHours || undefined,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    vendor: {
      _id: vendor._id,
      shopName: vendor.shopName,
      slug: vendor.slug,
      isApproved: vendor.isApproved,
    },
    token: generateToken(user._id),
  });
});

// @desc    Get logged-in vendor's own profile
// @route   GET /api/vendors/profile
// @access  Private/Vendor
const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id }).populate(
    'user',
    'name email role'
  );

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor profile not found');
  }
  res.json(vendor);
});

// @desc    Update logged-in vendor's profile
// @route   PUT /api/vendors/profile
// @access  Private/Vendor
const updateMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor profile not found');
  }

  const updatable = [
    'shopName',
    'description',
    'logo',
    'cuisineType',
    'foodType',
    'address',
    'contact',
    'openHours',
    'deliverySlots',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) vendor[field] = req.body[field];
  });

  if (req.body.shopName && req.body.shopName !== vendor.shopName) {
    vendor.slug = await buildUniqueSlug(req.body.shopName);
  }

  const updated = await vendor.save();
  res.json(updated);
});

// @desc    Public list of vendors (search/filter)
// @route   GET /api/vendors
// @access  Public
const listVendors = asyncHandler(async (req, res) => {
  const { keyword, foodType, city } = req.query;
  const filter = { isActive: true, isApproved: true };

  if (keyword) {
    filter.$or = [
      { shopName: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { cuisineType: { $regex: keyword, $options: 'i' } },
    ];
  }
  if (foodType) filter.foodType = foodType;
  if (city) filter['address.city'] = { $regex: city, $options: 'i' };

  const vendors = await Vendor.find(filter).select(
    'shopName slug logo cuisineType foodType address rating numReviews'
  );
  res.json(vendors);
});

// @desc    Get a single vendor by slug
// @route   GET /api/vendors/:slug
// @access  Public
const getVendorBySlug = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({
    slug: req.params.slug,
    isActive: true,
  });
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }
  res.json(vendor);
});

// @desc    Admin: list all vendors (including unapproved)
// @route   GET /api/vendors/admin/all
// @access  Private/Admin
const adminListVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({}).populate('user', 'name email');
  res.json(vendors);
});

// @desc    Admin: approve / unapprove vendor
// @route   PUT /api/vendors/admin/:id/approve
// @access  Private/Admin
const adminSetVendorApproval = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }
  vendor.isApproved = Boolean(req.body.isApproved);
  const updated = await vendor.save();
  res.json(updated);
});

module.exports = {
  registerVendor,
  getMyVendorProfile,
  updateMyVendorProfile,
  listVendors,
  getVendorBySlug,
  adminListVendors,
  adminSetVendorApproval,
};
