import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    min: 6,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
},{
  timestamps:true
});
