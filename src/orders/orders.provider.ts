import { Connection } from 'mongoose';
import { OrderSchema } from './shcema/orders.schema';

export const ordersProviders = [
  {
    provide: 'ORDERS_MODEL',
    useFactory: (connection: Connection) => connection.model('Order', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
