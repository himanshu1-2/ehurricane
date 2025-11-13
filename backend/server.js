const express = require('express');
const path = require('path');
const app = express();

const dotenv =  require('dotenv');
const cookieParser =  require('cookie-parser');
dotenv.config();
const connectDB =  require('./config/db.js');
const productRoutes =  require('./routes/productRoutes.js');
const userRoutes =  require('./routes/userRoutes.js');
const orderRoutes =  require('./routes/orderRoutes.js');
const uploadRoutes =  require('./routes/uploadRoutes.js');
const { notFound, errorHandler } =  require('./middleware/errorMiddleware.js');
const cors =  require('cors');
const Stripe =  require('stripe');
const { protect } =  require('./middleware/authMiddleware.js');
const Order =  require('./models/orderModel.js');

const stripe = new Stripe(process.env.STRIPE_SECRET);
const port = process.env.PORT || 5002;

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.post("/api/create-checkout-session/:id",async(req,res)=>{
  try{
  const {orderItems} = req.body.products;
  const lineItems = orderItems.map((product)=>({
      price_data:{
          currency:"inr",
          product_data:{
              name:product.name,
              //order_id:req.params.id
          },
          unit_amount:product.price * 100,
      },
      quantity:product.qty
  }));
  const customer = await stripe.customers.create({
    metadata:{
      order_id:req.params.id
    }
  })
const obj={
  payment_method_types:["card"],
  customer:customer.id,
  line_items:lineItems,
  mode:"payment",
  success_url: `${process.env.CLIENT_URL}/success`,
  cancel_url: `${process.env.CLIENT_URL}/cancel`,


}

console.log(obj)
// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   line_items: [
//     {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Cewa",
//         },
//         unit_amount: 200,
//       },
//       quantity: 1,
//     },
//   ],
//   mode: "payment",
//   success_url: "http://localhost:3000/sucess",
//   cancel_url: "http://localhost:3000/cancel",
// });
const session = await stripe.checkout.sessions.create(obj)

  res.json({id:session.id})
}
catch(e){
  console.log(e)
}
})
app.post('/stripe_webhooks', express.json({type: 'application/json'}), async(request, response) => {
  const event = request.body;

  // Handle the event

let  paymentIntent ;
  switch (event.type) {
    case 'payment_intent.succeeded':
        paymentIntent = event.data.object;
         const c = await stripe.customers.retrieve(paymentIntent.customer)
         await Order.updateOne({_id:c.metadata.order_id},{isPaid:true ,paidAt:new Date()})
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
    }
    console.log(paymentIntent)
  if(paymentIntent){
    //await Order.updateOne()

  }
  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});
const __root = path.resolve(); // consistent base path

// serve uploaded files from backend/uploads in all environments
app.use('/uploads', express.static(path.join(__root, 'uploads')));

// keep production static setup for frontend after uploads middleware
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__root, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__root, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
