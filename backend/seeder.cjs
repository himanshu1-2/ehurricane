const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

const users = require('./data/users.js');
const products = require('./data/products.js');
const orders = require('./data/orders.js');

const User = require('./models/userModel.js');
const Product = require('./models/productModel.js');
const Order = require('./models/orderModel.js');
const connectDB = require('./config/db.js');


dotenv.config();

const importData = async () => {
  try {
    if (!Array.isArray(users) || users.length === 0) {
      console.error('No users found in ./data/users.js');
      process.exit(1);
    }

    // hash passwords
    const usersToInsert = users.map(u => ({
      ...u,
      //password: bcrypt.hashSync(u.password, 10)
    }));

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(usersToInsert);
    const adminUser = createdUsers[0]._id;

    // attach admin user to products
    const sampleProducts = products.map(product => ({ ...product, user: adminUser }));
    const createdProducts = await Product.insertMany(sampleProducts);

    // build name -> product doc map for order mapping
    const nameToProduct = {};
    createdProducts.forEach(p => {
      if (p.name) nameToProduct[p.name] = p;
    });

    // default shipping address used when missing
    const defaultShipping = {
      address: '123 Test St',
      city: 'Testville',
      postalCode: '00000',
      country: 'Country'
    };

    // prepare orders following Order schema: attach product ObjectId, price, user, computed totals
    const ordersToInsert = (Array.isArray(orders) ? orders : []).map(o => {
      const orderItems = (o.orderItems || []).map(item => {
        const prod = nameToProduct[item.name];
        const qty = Number(item.qty || item.quantity || 0);
        const price = prod ? Number(prod.price || 0) : Number(item.price || 0);
        const image = prod ? prod.image : (item.image || '/images/sample.jpg');

        return {
          name: prod ? prod.name : item.name,
          qty,
          price,
          image,
          product: prod ? prod._id : null
        };
      }).filter(it => it.qty > 0);

      const itemsPrice = orderItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 0)), 0);
      const taxPrice = 0;
      const shippingPrice = 0;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      return {
        user: adminUser,
        orderItems,
        shippingAddress: o.shippingAddress || defaultShipping,
        paymentMethod: o.paymentMethod || 'N/A',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: !!o.isPaid,
        paidAt: o.paidAt || null,
        isDelivered: !!o.isDelivered,
        deliveredAt: o.deliveredAt || null,
        createdAt: o.createdAt ? new Date(o.createdAt) : new Date()
      };
    });

    if (ordersToInsert.length) {
      await Order.insertMany(ordersToInsert);
    }

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const run = async () => {
  try {
    await connectDB();

    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await importData();
    }
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

run();
