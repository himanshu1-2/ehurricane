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
  getCategories, // added export
} = require('../controllers/productController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/categories', getCategories); // new endpoint for distinct categories
router.route('/top').get(getTopProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
