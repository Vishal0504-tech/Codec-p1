import Stripe from 'stripe';

// @desc    Create a Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private (Requires login)
export const createCheckoutSession = async (req, res) => {
  // Initialize Stripe here inside the controller handler, ensuring process.env is already populated by dotenv
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { cartItems, orderId } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in the shopping cart.' });
    }

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required to create a checkout session.' });
    }

    // Map our application cart items to Stripe's expected "line_items" format.
    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd', // Define the currency (Stripe expects lower case)
          product_data: {
            name: item.name, // Product name
            images: item.images || item.image ? [item.images ? item.images[0] : item.image] : [], // Product image
          },
          // Stripe processes payments in the smallest currency unit (cents).
          // We multiply by 100 and round to convert dollars to cents (e.g. $10.99 becomes 1099 cents).
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty, // Number of items purchased
      };
    });

    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin;

    // Create the session configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Allow credit card payments
      line_items: lineItems,
      mode: 'payment', // "payment" mode is for one-time checkouts
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'IN'], // Allow shipping to these major countries
      },
      // Define redirection hooks on success or cancellation:
      // {CHECKOUT_SESSION_ID} is a dynamic variable Stripe will replace with the real session ID on success
      success_url: `${frontendUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout-failed`,
      // Attach the user ID and order ID as metadata to identify who placed this checkout
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId,
      },
    });

    // Send back the secure URL link to the client
    res.json({ url: session.url });
  } catch (error) {
    console.error(`Stripe Session Error: ${error.message}`);
    res.status(500).json({ message: `Stripe Integration Error: ${error.message}` });
  }
};
