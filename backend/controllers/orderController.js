import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';

// @desc    Create a new order in the database
// @route   POST /api/orders
// @access  Private (Requires login)
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  try {
    // If request contains an empty cart array, abort
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in the checkout cart.' });
    }

    // Create a new order instance
    const order = new Order({
      user: req.user._id, // Set the user ID attached by the auth middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false, // Starts as unpaid until Stripe payment completes
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch a single order by ID
// @route   GET /api/orders/:id
// @access  Private (Requires login)
export const getOrderById = async (req, res) => {
  try {
    // We populate the user details from the reference to show name and email
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Security: Only allow the owner of the order or an administrator to view it
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order.' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Requires login)
export const getMyOrders = async (req, res) => {
  try {
    // Find all orders that belong to the active user's ID
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm and pay order after Stripe redirect
// @route   POST /api/orders/confirm
// @access  Private
export const confirmOrder = async (req, res) => {
  const { sessionId } = req.body;

  try {
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required.' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Stripe checkout session not found.' });
    }

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment has not been completed.' });
    }

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({ message: 'No Order ID attached to payment session.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found in database.' });
    }

    // If already marked as paid, just return success (idempotency check)
    if (order.isPaid) {
      return res.json({ message: 'Order is already marked as paid.', order });
    }

    // Update order with payment details and Stripe collected address
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: session.payment_intent,
      status: session.payment_status,
      update_time: Date.now().toString(),
      email_address: session.customer_details?.email || '',
    };

    // Robust parsing of shipping address from Stripe session details
    const shippingDetails = session.shipping_details || session.collected_information?.shipping_details || (session.customer_details?.address ? { address: session.customer_details.address } : null);

    if (shippingDetails && shippingDetails.address) {
      const { address } = shippingDetails;
      order.shippingAddress = {
        address: address.line1 + (address.line2 ? `, ${address.line2}` : ''),
        city: address.city || '',
        postalCode: address.postal_code || '',
        country: address.country || '',
      };
    }

    const updatedOrder = await order.save();

    // Decrement stock for each item in the order
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Decrease stock (but make sure it doesn't go below 0)
        product.stock = Math.max(0, product.stock - item.qty);
        await product.save();
      }
    }

    res.json({ message: 'Order paid and confirmed successfully.', order: updatedOrder });
  } catch (error) {
    console.error(`Order Confirm Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
