
import { Connection } from 'mongoose';
import { CategorySchema } from './schema/categories.schema';

export const CateogirsProviders = [
  {
    provide: 'CATEGORIES_MODEL',
    useFactory: (connection: Connection) => connection.model('Category', CategorySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
