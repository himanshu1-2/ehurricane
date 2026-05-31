const express =  require('express');
const router = express.Router();
const {
addOrderItems,
getMyOrders,
getOrderById,
updateOrderToPaid,
updateOrderToDelivered,
updateOrderStatus,
getOrders,
} =  require('../controllers/orderController.js');
const { protect, admin, vendor } =  require('../middleware/authMiddleware.js');


router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, vendor, updateOrderStatus);

module.exports=router;
