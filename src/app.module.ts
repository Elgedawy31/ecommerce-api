import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './users/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './common/providers/cloudinary.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    DatabaseModule, 
    UsersModule, 
    AuthModule, 
    ProductsModule, 
    CategoriesModule, 
    OrdersModule ,
    CloudinaryModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
