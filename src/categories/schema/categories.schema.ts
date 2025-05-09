import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    minlength: [3, 'Category name must be at least 3 characters.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    minlength: [15, 'Description must be at least 15 characters.'],
    trim: true,
  },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  versionKey: false, // Removes the __v field
});
