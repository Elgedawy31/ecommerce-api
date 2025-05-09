
import { Connection } from 'mongoose';
import { ProductSchema } from './schema/products.schema';

export const ProductsProvider = [
  {
    provide: 'PRODUCTS_MODEL',
    useFactory: (connection: Connection) => connection.model('Product', ProductSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
