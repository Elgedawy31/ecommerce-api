import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    minlength: [3, 'Product name must be at least 3 characters.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    minlength: [15, 'Description must be at least 15 characters.'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
    min: [0, 'Price cannot be negative.'],
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: [0, 'Discount price cannot be negative.'],
    validate: {
      validator: function (value: number) {
        return value <= this.price;
      },
      message: 'Discount price cannot be higher than the price.',
    },
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required.'],
    min: [0, 'Stock cannot be negative.'],
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (value: string[]) {
        return Array.isArray(value);
      },
      message: 'Images must be an array of strings.',
    },
  },
  categoryId: {
    type: Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required.'],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  versionKey: false, // Removes the __v field
});
