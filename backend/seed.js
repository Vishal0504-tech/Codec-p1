import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import dns from 'node:dns';

// Load environment configurations
dotenv.config();

// Apply the Windows DNS workaround to avoid querySrv ECONNREFUSED resolution failure on Windows systems.
dns.setServers(['1.1.1.1', '8.8.8.8']);

// 10 Sample products to seed the catalog database
const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Experience premium auditory immersion with active noise canceling technology. Includes a 30-hour battery life and quick charge adapters.',
    price: 299,
    category: 'Electronics',
    brand: 'Sony',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.8,
    numReviews: 24,
  },
  {
    name: 'Professional DSLR Camera',
    description: 'Capture stunning high-resolution details with our 24.1 megapixel sensor DSLR. Package comes with custom standard kit lens.',
    price: 899,
    category: 'Electronics',
    brand: 'Canon',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.6,
    numReviews: 18,
  },
  {
    name: 'Ultra-Thin Gaming Laptop',
    description: 'Dominate the battlefield with standard graphics, a fast refresh display, 16GB memory, and advanced cooling structures.',
    price: 1499,
    category: 'Electronics',
    brand: 'Asus',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.7,
    numReviews: 32,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Monitor your health indexes, sleep patterns, heart rate, and workouts using this GPS-integrated fitness tracking watch.',
    price: 199,
    category: 'Electronics',
    brand: 'Garmin',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.4,
    numReviews: 45,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable lumber support, seat depth controls, and breathable mesh back. Keeps you comfortable during long working hours.',
    price: 349,
    category: 'Furniture',
    brand: 'Steelcase',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.5,
    numReviews: 14,
  },
  {
    name: 'Minimalist Wooden Desk',
    description: 'Handcrafted solid oak wood desk with dual storage drawers and sleek metal legs. Ideal for home office spaces.',
    price: 499,
    category: 'Furniture',
    brand: 'Ikea',
    stock: 4,
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.3,
    numReviews: 9,
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: 'Brew delicious espresso or drip coffee with this commercial-grade thermocoil heating system espresso machine.',
    price: 599,
    category: 'Appliances',
    brand: 'Breville',
    stock: 6,
    images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.8,
    numReviews: 29,
  },
  {
    name: 'Robotic Vacuum Cleaner',
    description: 'Autonomous vacuum cleaning robot with Wi-Fi connectivity, smart layout mapping, and strong pet hair suction power.',
    price: 249,
    category: 'Appliances',
    brand: 'iRobot',
    stock: 11,
    images: ['https://images.unsplash.com/photo-1518133680790-399fcd6a5095?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.2,
    numReviews: 21,
  },
  {
    name: 'Running Athletic Shoes',
    description: 'Lightweight running shoes built with comfortable cushioning, breathable knit upper, and durable rubber traction grips.',
    price: 129,
    category: 'Footwear',
    brand: 'Nike',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.6,
    numReviews: 38,
  },
  {
    name: 'Leather Waterproof Backpack',
    description: 'Heavy duty canvas backpack with water-resistant leather coatings. Dedicated 15.6" laptop protection sleeve inside.',
    price: 89,
    category: 'Accessories',
    brand: 'Herschel',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60'],
    ratings: 4.5,
    numReviews: 17,
  },
];

const seedData = async () => {
  try {
    // Establish connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection active. Preparing to seed database...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('10 Sample products seeded successfully!');

    // Close process successfully
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed with error: ${error.message}`);
    process.exit(1);
  }
};

// Run the script
seedData();
