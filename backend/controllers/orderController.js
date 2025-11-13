const asyncHandler =  require('../middleware/asyncHandler.js');
const Order =  require('../models/orderModel.js');
const Product =  require('../models/productModel.js');
const nodemailer = require('nodemailer')

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
    // 1️⃣ Update product stock
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        if (product.countInStock < item.qty) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { countInStock: -item.qty } },
          { new: true }
        );
      })
    );

    // 2️⃣ Create the order
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
    
    // 3️⃣ Send email to admin (YOU)
    sendAdminEmail(createdOrder, req.user).catch((err) =>
      console.error('Admin email send failed:', err.message)
    );

    // 4️⃣ Respond same as before
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || 'Order creation failed');
  }
});

// 💌 Helper: Send email to admin when order is placed
const sendAdminEmail = async (order, user) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER, // your Gmail or SMTP username
      pass: process.env.SMTP_PASS, // app password
    },
  });

  const mailOptions = {
    from: `"E-Commerce App" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // 👈 your email
    subject: `🛒 New Order Received - ${order._id}`,
    html: `
      <h2>New Order Placed!</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
  
      <h3>Order Summary:</h3>
      <ul>
        ${order.orderItems
          .map(
            (item) =>
              `<li>${item.name} - ${item.qty} × ₹${item.price} = ₹${item.qty * item.price}</li>`
          )
          .join('')}
      </ul>
      <p><strong>Total:</strong> ₹${order.totalPrice}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <h3>Shipping Address:</h3>
      <p>${order.shippingAddress.address}, ${order.shippingAddress.mobile}, ${order.shippingAddress.postalCode}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};












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
    order.status="Paid"
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
