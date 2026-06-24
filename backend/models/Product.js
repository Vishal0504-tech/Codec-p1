import mongoose from 'mongoose';

// The Product Schema defines what fields a Product document contains inside our MongoDB database.
const productSchema = new mongoose.Schema({
  // name: The name or title of the product.
  name: {
    type: String,
    required: true,
  },
  // description: A detailed text explanation of what the product is and its specifications.
  description: {
    type: String,
    required: true,
  },
  // price: The numeric price of the item. Defaults to 0.
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  // category: The category group (e.g. "Electronics", "Clothing") for filtering.
  category: {
    type: String,
    required: true,
  },
  // brand: The manufacturer or brand name of the product.
  brand: {
    type: String,
    required: true,
  },
  // stock: The number of items currently available in inventory. Defaults to 0.
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  // images: A list (array) of string URLs pointing to the product's photos.
  images: {
    type: [String],
    required: true,
  },
  // ratings: The average rating score (out of 5 stars) from customer reviews. Defaults to 0.
  ratings: {
    type: Number,
    required: true,
    default: 0,
  },
  // numReviews: The total count of reviews written for this product. Defaults to 0.
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  // createdAt: Logs the exact timestamp when this product was added to the catalog.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
