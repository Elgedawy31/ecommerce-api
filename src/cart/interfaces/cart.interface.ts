import { Document, Types } from 'mongoose';

export interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
