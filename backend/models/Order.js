import mongoose from 'mongoose';

// The Order Schema defines purchase details, items purchased, totals, and fulfillment status in MongoDB.
const orderSchema = new mongoose.Schema(
  {
    // user: References the User document of the customer who placed the order.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // orderItems: An array of nested objects mapping names, quantities, and price info for bought items.
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    // shippingAddress: Delivery destination information.
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // paymentMethod: Payment processor provider (e.g. "Stripe").
    paymentMethod: {
      type: String,
      required: true,
    },
    // paymentResult: Detailed metadata logs generated and returned by Stripe.
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    // totalPrice: The total price charged (subtotal + tax + delivery). Defaults to 0.0.
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // isPaid: Tracks if checkout transaction is successfully completed.
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    // paidAt: Timestamp showing when payment is received.
    paidAt: {
      type: Date,
    },
    // isDelivered: Tracks if shipping carrier has completed delivery.
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    // deliveredAt: Timestamp showing when items were delivered.
    deliveredAt: {
      type: Date,
    },
  },
  {
    // timestamps: Mongoose automatically manages createdAt and updatedAt fields for every order.
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
