const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  listMyProducts,
} = require('../controllers/productController.js');
const { protect, admin, vendor } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.get('/categories', getCategories); // new endpoint for distinct categories
router.get('/mine', protect, vendor, listMyProducts);
router.route('/top').get(getTopProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, vendor, updateProduct)
  .delete(protect, vendor, deleteProduct);

module.exports = router;
