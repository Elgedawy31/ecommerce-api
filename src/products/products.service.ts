import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Product } from "./interfaces/products.interface";
import { ResponseShape } from "src/interfaces/response.interface";

@Injectable()
export class ProductsService{
  constructor(@Inject('PRODUCTS_MODEL') private ProductModel:Model<Product>){}
    async findAll(page: number = 1, limit: number = 10): Promise<ResponseShape> {
      const skip = (page - 1) * limit;
      const totalUsers = await this.ProductModel.countDocuments();
      const users = await this.ProductModel.find().skip(skip).limit(limit).exec();
      const totalPages = Math.ceil(totalUsers / limit) || 0
      return {
        page,
        limit,
        data: users,
        total: totalUsers,
        totalPages,
        success: true,
      };
    }
  
}