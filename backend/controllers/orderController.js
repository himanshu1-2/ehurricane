const asyncHandler =  require('../middleware/asyncHandler.js');
const Order =  require('../models/orderModel.js');
const Product =  require('../models/productModel.js');
const  calcPrices  =  require('../utils/calcPrices.js');



const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  try {
    // Update stock and collect updated products
    const updatedProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.countInStock < item.qty) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Atomic decrement and return updated doc
        const updatedProduct = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { countInStock: -item.qty } },
          { new: true } // ensures updated value is returned
        );

       
      })
    );
  
    // Create order
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    
    const createdOrder = await order.save();

    // Return both order and updated product stocks
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || 'Order creation failed');
  }
});









// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({_id:-1})
  res.json(orders)
})

module.exports= {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
