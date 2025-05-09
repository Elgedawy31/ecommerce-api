import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './interfaces/products.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { CloudinaryService } from 'src/common/providers/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_MODEL') private ProductModel: Model<Product>,
    private cloudinaryService: CloudinaryService
  ) {}

  async uploadProductImages(files: any[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }
    
    const uploadResults = await this.cloudinaryService.uploadMultipleImages(files);
    return uploadResults.map(result => result.secure_url);
  }
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

  async createProduct(body: CreateProductDto, files?: any[]): Promise<ResponseShape> {
    let productData = { ...body };
    
    // Upload images if provided
    if (files && files.length > 0) {
      const imageUrls = await this.uploadProductImages(files);
      productData.images = [...(body.images || []), ...imageUrls];
    }
    
    const Product = new this.ProductModel(productData);
    const createdProduct = await Product.save();
    return {
      data: createdProduct,
      message: 'Product created successfully',
      success: true,
    };
  }
    async updateProduct(id: string, body: UpdateProductDto, files?: any[]): Promise<ResponseShape> {
      let updateData = { ...body };
      
      // Upload new images if provided
      if (files && files.length > 0) {
        const imageUrls = await this.uploadProductImages(files);
        
        // Get current product to append to existing images
        const currentProduct = await this.ProductModel.findById(id);
        if (currentProduct) {
          updateData.images = [...(currentProduct.images || []), ...imageUrls];
        } else {
          updateData.images = imageUrls;
        }
        
        // If body.images is provided, use that instead (allows for image removal)
        if (body.images) {
          updateData.images = body.images;
        }
      }
      
      const updatedProduct = await this.ProductModel.findByIdAndUpdate(id, updateData, {
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
