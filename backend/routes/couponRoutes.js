const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getApplicableCoupon,
} = require('../controllers/couponController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router
  .route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

// must be registered before '/:id' so it isn't matched as an id
router.get('/applicable', protect, getApplicableCoupon);

router
  .route('/:id')
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;
