import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard summary statistics (Revenue, Orders, Products, Users)
// @route   GET /api/admin/summary
// @access  Private/Admin
export const getSummary = async (req, res) => {
  try {
    // 1. Calculate Total Revenue by summing totalPrice of all paid orders
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // 2. Count total orders placed
    const totalOrders = await Order.countDocuments();

    // 3. Count total unique products in catalog
    const totalProducts = await Product.countDocuments();

    // 4. Count total registered user accounts
    const totalUsers = await User.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (with user details)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    // Find all orders in database, populate reference user's name and email details, sort by newest
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status to Delivered
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Return all users excluding their password hashes
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Safety block: prevent deleting an admin account
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Administrative accounts cannot be deleted.' });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User account removed successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
