const asyncHandler = require('../middleware/asyncHandler.js');
const Product = require('../models/productModel.js');

// @desc    Fetch all products (with optional category filter & search)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // filter by category if provided
  const categoryFilter = req.query.category
    ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } }
    : {};
  let gender
  const filter= { ...keyword, ...categoryFilter ,
    countInStock: { $gt: 0 }
};
  if(req.query.gender){
    filter = { ...keyword, ...categoryFilter ,gender};
  }
   
  const count = await Product.countDocuments(filter);
  //console.log(filter)
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // use uploaded file if present, otherwise fallback to sample
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '/images/sample.jpg';

  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: imagePath,
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor (owner) or Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { gender,name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin' || req.user.isAdmin;
    if (!isAdmin && product.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.gender = gender

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor (owner) or Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin' || req.user.isAdmin;
    if (!isAdmin && product.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// @desc    List products owned by the logged-in vendor
// @route   GET /api/products/mine
// @access  Private/Vendor
const listMyProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const filter = { ...keyword, user: req.user._id };
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get product categories (distinct)
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories.filter(Boolean).sort());
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  listMyProducts,
};
