import * as mongoose from 'mongoose';

export const DatabaseProviders = [
    {
        provide:'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect(process.env.MONGO_URI || ''),
        
    }
]