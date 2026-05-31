const { initFirebase } = require('./firebaseAdmin.js');

const NEW_ORDER_TOPIC = 'new-orders';

const sendOrderPushToAdmin = async (order) => {
  const fb = initFirebase();
  if (!fb) return;

  const message = {
    topic: NEW_ORDER_TOPIC,
    notification: {
      title: 'New order received',
      body: `Order ${String(order._id).slice(-6)} • ₹${order.totalPrice}`,
    },
    data: {
      orderId: String(order._id),
      totalPrice: String(order.totalPrice),
      url: `/order/${order._id}`,
    },
    webpush: {
      fcmOptions: { link: `/order/${order._id}` },
    },
  };

  try {
    await fb.messaging().send(message);
  } catch (err) {
    console.error('[firebase] sendOrderPushToAdmin failed:', err.message);
  }
};

// Send a push notification directly to one device token.
const sendPushToToken = async (token, { title, body, data = {}, link } = {}) => {
  const fb = initFirebase();
  if (!fb || !token) return;

  const message = {
    token,
    notification: { title, body },
    // FCM requires all data values to be strings.
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
  };
  if (link) {
    message.webpush = { fcmOptions: { link } };
  }

  try {
    await fb.messaging().send(message);
  } catch (err) {
    console.error('[firebase] sendPushToToken failed:', err.message);
  }
};

// Send the same notification to many device tokens (falsy tokens skipped).
const sendPushToTokens = async (tokens = [], payload = {}) => {
  const unique = [...new Set(tokens.filter(Boolean))];
  await Promise.all(unique.map((t) => sendPushToToken(t, payload)));
};

// Notify the vendor(s) that own the products in an order that it was placed.
const sendOrderPushToVendors = async (order, vendorTokens = []) => {
  await sendPushToTokens(vendorTokens, {
    title: 'New order received',
    body: `Order ${String(order._id).slice(-6)} • ₹${order.totalPrice}`,
    data: {
      orderId: String(order._id),
      totalPrice: String(order.totalPrice),
      url: `/order/${order._id}`,
    },
    link: `/order/${order._id}`,
  });
};

// Notify the customer that their order is being prepared.
const sendOrderReadyPushToCustomer = async (order, customerToken) => {
  await sendPushToToken(customerToken, {
    title: 'Your order is getting ready',
    body: `Order ${String(order._id).slice(-6)} is being prepared.`,
    data: {
      orderId: String(order._id),
      status: String(order.status || 'Preparing'),
      url: `/order/${order._id}`,
    },
    link: `/order/${order._id}`,
  });
};

const subscribeTokenToOrders = async (token) => {
  const fb = initFirebase();
  if (!fb) throw new Error('Firebase Admin not configured');
  await fb.messaging().subscribeToTopic([token], NEW_ORDER_TOPIC);
};

module.exports = {
  sendOrderPushToAdmin,
  sendPushToToken,
  sendPushToTokens,
  sendOrderPushToVendors,
  sendOrderReadyPushToCustomer,
  subscribeTokenToOrders,
  NEW_ORDER_TOPIC,
};
