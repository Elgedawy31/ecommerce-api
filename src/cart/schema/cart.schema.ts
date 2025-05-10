import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
  productId: {
    type: Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required.'],
  },
  name: {
    type: String,
    required: [true, 'Product name is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
    min: [0, 'Product price cannot be negative.'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
    min: [1, 'Quantity must be at least 1.'],
  },
  total: {
    type: Number,
    required: [true, 'Total for this item is required.'],
    min: [0, 'Total cannot be negative.'],
  },
});

// Main Cart Schema
export const CartSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required.'],
  },
  items: {
    type: [CartItemSchema],
    validate: {
      validator: function (value: any[]) {
        return value.length > 0;
      },
      message: 'Cart must contain at least one item.',
    },
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required.'],
    min: [0, 'Total price cannot be negative.'],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  versionKey: false, // Removes the __v field
});
