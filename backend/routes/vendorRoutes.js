const express = require('express');
const {
  registerVendor,
  getMyVendorProfile,
  updateMyVendorProfile,
  listVendors,
  getVendorBySlug,
  adminListVendors,
  adminSetVendorApproval,
} = require('../controllers/vendorController.js');
const { protect, admin, vendor } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerVendor);
router.get('/', listVendors);

router
  .route('/profile')
  .get(protect, vendor, getMyVendorProfile)
  .put(protect, vendor, updateMyVendorProfile);

router.get('/admin/all', protect, admin, adminListVendors);
router.put('/admin/:id/approve', protect, admin, adminSetVendorApproval);

router.get('/:slug', getVendorBySlug);

module.exports = router;
