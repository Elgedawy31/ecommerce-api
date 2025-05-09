import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './interfaces/products.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject('PRODUCTS_MODEL') private ProductModel: Model<Product>) {}
  async findAll(page: number = 1, limit: number = 10): Promise<ResponseShape> {
    const skip = (page - 1) * limit;
    const totalProducts = await this.ProductModel.countDocuments();
    const Products = await this.ProductModel.find().skip(skip).limit(limit).exec();
    const totalPages = Math.ceil(totalProducts / limit) || 0;
    return {
      page,
      limit,
      data: Products,
      total: totalProducts,
      totalPages,
      success: true,
    };
  }

  async createProduct(body: CreateProductDto): Promise<ResponseShape> {
    const Product = new this.ProductModel(body);
    const createdProduct = await Product.save();
    return {
      data: createdProduct,
      message: 'Product created successfully',
      success: true,
    };
  }
    async updateProduct(id: string, body: UpdateProductDto): Promise<ResponseShape> {
      const updatedProduct = await this.ProductModel.findByIdAndUpdate(id, body, {
        new: true,
      });
      return {
        data: updatedProduct,
        message: 'product updated successfully',
        success: true,
      };
    }
    async getProduct(id: string): Promise<ResponseShape> {
      const Product = await this.ProductModel.findById(id);
      return {
        data: Product,
        success: true,
      };
    }
    async deleteProduct(id: string): Promise<ResponseShape> {
      const Product = await this.ProductModel.findByIdAndDelete(id);
      return {
        data: Product,
        message: 'Product deleted successfully',
        success: true,
      };
    }
}
