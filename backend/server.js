import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Establish the database connection
connectDB();

// Apply middleware
app.use(cors()); // Allow queries from frontends on different ports/domains
app.use(express.json()); // Allow reading JSON bodies in request payloads

// Mount authentication API routes
app.use('/api/auth', authRoutes);

// Mount product API routes
app.use('/api/products', productRoutes);

// Mount order API routes
app.use('/api/orders', orderRoutes);

// Mount payment API routes
app.use('/api/payment', paymentRoutes);

// Mount administrative API routes
app.use('/api/admin', adminRoutes);

// Base/Test API route
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully...' });
});

// Configure the port and listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
