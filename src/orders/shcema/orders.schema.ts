import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

// Schema for each item in the order
const OrderItemSchema = new mongoose.Schema({
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
    required: [true, 'Product quantity is required.'],
    min: [1, 'Product quantity must be at least 1.'],
  },
  total: {
    type: Number,
    required: [true, 'Total for this item is required.'],
    min: [0, 'Total cannot be negative.'],
  },
});

// Main Order Schema
export const OrderSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required.'],
  },
  items: {
    type: [OrderItemSchema], // Array of items
    validate: {
      validator: function (value: any[]) {
        return value.length > 0;
      },
      message: 'Order must contain at least one item.',
    },
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required.'],
    min: [0, 'Total price cannot be negative.'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  shippingAddress: {
    fullName: { type: String, required: [true, 'Full name is required.'] },
    street: { type: String, required: [true, 'Street is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    postalCode: { type: String, required: [true, 'Postal code is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  versionKey: false, // Removes the __v field
});
