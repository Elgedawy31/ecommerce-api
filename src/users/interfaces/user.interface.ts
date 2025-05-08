import { Document } from 'mongoose';

export interface Users extends Document {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly password: string;
  readonly address: string;
  readonly phone: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly _id: string;
  readonly __v: number;
}
