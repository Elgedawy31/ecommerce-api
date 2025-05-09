import { Document, Types } from 'mongoose';

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
