import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

// @desc    Fetch all products (with search, category/price filter, and pagination)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  // Define page size (how many products we show per page)
  const pageSize = 6;
  
  // Extract query parameters from request URL
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword || '';
  const category = req.query.category || '';
  const minPrice = Number(req.query.minPrice) || 0;
  const maxPrice = Number(req.query.maxPrice) || Infinity;

  try {
    // 1. Search Query: If a keyword is provided, we search the 'name' field using MongoDB's $regex operator.
    // $regex does a text search. $options: 'i' makes it case-insensitive (e.g. "phone" matches "iPhone").
    const searchFilter = keyword
      ? {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        }
      : {};

    // 2. Category Filter: If a category is provided, add it to our filters.
    const categoryFilter = category && category !== 'All' ? { category } : {};

    // 3. Price Filter: We filter price using MongoDB operators:
    // $gte = Greater Than or Equal to (minimum price limit)
    // $lte = Less Than or Equal to (maximum price limit)
    const priceFilter = {
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    // Combine all filters together
    const queryFilters = {
      ...searchFilter,
      ...categoryFilter,
      ...priceFilter,
    };

    // Count the total number of products matching our filters (needed to calculate total pages)
    const count = await Product.countDocuments(queryFilters);

    // Fetch the products matching our filters from database.
    // .limit(pageSize) restricts the output to our page size.
    // .skip(pageSize * (page - 1)) skips products from previous pages. E.g. for page 2, skip first 6 products.
    const products = await Product.find(queryFilters)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Show newest products first

    // Return products, current page number, total pages, and total count matching query
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, price, description, category, brand, stock, images } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      brand,
      stock,
      images: images || ['/images/placeholder.jpg'],
      ratings: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, price, description, category, brand, stock, images } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? stock : product.stock;
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top 4 recommended products based on co-purchases (Collaborative Filtering)
// @route   GET /api/products/:id/recommendations
// @access  Public
export const getRecommendations = async (req, res) => {
  const productId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    // 1. Run MongoDB Aggregation Pipeline to find products bought together with target product
    const recommendations = await Order.aggregate([
      // A. Match paid orders containing the target product
      {
        $match: {
          isPaid: true,
          'orderItems.product': new mongoose.Types.ObjectId(productId),
        },
      },
      // B. Flatten orderItems array to inspect individual purchases
      {
        $unwind: '$orderItems',
      },
      // C. Exclude the target product itself so we don't recommend it to itself
      {
        $match: {
          'orderItems.product': { $ne: new mongoose.Types.ObjectId(productId) },
        },
      },
      // D. Group by co-purchased product ID and sum their counts
      {
        $group: {
          _id: '$orderItems.product',
          count: { $sum: 1 },
        },
      },
      // E. Sort by frequency in descending order
      {
        $sort: { count: -1 },
      },
      // F. Limit recommendations to top 4 items
      {
        $limit: 4,
      },
      // G. Join with products collection to retrieve product properties
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      // H. Flatten joined productInfo array
      {
        $unwind: '$productInfo',
      },
      // I. Project clean object format matching original Product structure
      {
        $project: {
          _id: '$productInfo._id',
          name: '$productInfo.name',
          price: '$productInfo.price',
          description: '$productInfo.description',
          category: '$productInfo.category',
          brand: '$productInfo.brand',
          stock: '$productInfo.stock',
          images: '$productInfo.images',
          ratings: '$productInfo.ratings',
          numReviews: '$productInfo.numReviews',
          count: 1,
        },
      },
    ]);

    // 2. Fallback check: If fewer than 4 co-purchases exist, fill with category items (avoid cold start)
    if (recommendations.length < 4) {
      const currentProduct = await Product.findById(productId);
      if (currentProduct) {
        // Collect currently recommended IDs and the target product ID to exclude them
        const excludeIds = [
          new mongoose.Types.ObjectId(productId),
          ...recommendations.map((rec) => rec._id),
        ];

        // Fetch products in same category
        const categoryFallback = await Product.find({
          category: currentProduct.category,
          _id: { $nin: excludeIds },
        })
          .limit(4 - recommendations.length)
          .select('-description');

        recommendations.push(...categoryFallback);
      }
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
