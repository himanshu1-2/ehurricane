const express =  require('express');
const router = express.Router();
const {
getProducts,
getProductById,
createProduct,
updateProduct,
deleteProduct,
createProductReview,
getTopProducts,
} =  require('../controllers/productController.js');
const { protect, admin } =  require('../middleware/authMiddleware.js');
const checkObjectId =  require('../middleware/checkObjectId.js');


router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

  module.exports=router;
