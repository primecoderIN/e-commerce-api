const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    maxlength: [120, "Product name should not be more than 120 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a product price"],
    maxlength: [5, "Product price should not be more than 5 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
    trim: true,
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select a product category"],
    enum: {
      values: ["short sleeves", "long-sleeves", "hoodies"],
      message: "Invalid product category selected",
    },
  },
  brand: {
    type: String,
    required: [true, "Please add a brand name"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      postedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true, //Any time a product is created this is required
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = ProductSchema;
