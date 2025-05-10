import { Connection } from 'mongoose';
import { CartSchema } from './schema/cart.schema';

export const CartsProviders = [
  {
    provide: 'CART_MODEL',
    useFactory: (connection: Connection) => connection.model('Cart', CartSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
