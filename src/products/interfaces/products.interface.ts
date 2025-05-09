import { Document } from 'mongoose';

export interface Product extends Document {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly discountPrice: number;
  readonly images: string[];
  readonly stock: number;
  readonly categoryId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly _id: string;
  readonly __v: number;
}
