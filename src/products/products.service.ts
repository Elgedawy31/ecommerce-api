import { Inject, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      if (!files || files.length === 0) {
        return [];
      }
      
      const uploadResults = await this.cloudinaryService.uploadMultipleImages(files);
      return uploadResults.map(result => result.secure_url);
    } catch (error) {
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }
  async findAll(page: number = 1, limit: number = 10): Promise<ResponseShape> {
    try {
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
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch products',
        success: false,
      };
    }
  }

  async createProduct(body: CreateProductDto, files?: any[]): Promise<ResponseShape> {
    try {
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
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to create product',
        success: false,
      };
    }
  }
    async updateProduct(id: string, body: UpdateProductDto, files?: any[]): Promise<ResponseShape> {
      try {
        // Check if product exists
        const existingProduct = await this.ProductModel.findById(id);
        if (!existingProduct) {
          return {
            data: null,
            error: `Product with ID ${id} not found`,
            success: false,
          };
        }
        
        let updateData = { ...body };
        
        // Upload new images if provided
        if (files && files.length > 0) {
          const imageUrls = await this.uploadProductImages(files);
          updateData.images = [...(existingProduct.images || []), ...imageUrls];
          
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
          message: 'Product updated successfully',
          success: true,
        };
      } catch (error) {
        return {
          data: null,
          error: error.message || 'Failed to update product',
          success: false,
        };
      }
    }
    async getProduct(id: string): Promise<ResponseShape> {
      try {
        const product = await this.ProductModel.findById(id);
        
        if (!product) {
          return {
            data: null,
            error: `Product with ID ${id} not found`,
            success: false,
          };
        }
        
        return {
          data: product,
          success: true,
        };
      } catch (error) {
        return {
          data: null,
          error: error.message || 'Failed to fetch product',
          success: false,
        };
      }
    }
    async deleteProduct(id: string): Promise<ResponseShape> {
      try {
        const product = await this.ProductModel.findById(id);
        
        if (!product) {
          return {
            data: null,
            error: `Product with ID ${id} not found`,
            success: false,
          };
        }
        
        const deletedProduct = await this.ProductModel.findByIdAndDelete(id);
        
        return {
          data: deletedProduct,
          message: 'Product deleted successfully',
          success: true,
        };
      } catch (error) {
        return {
          data: null,
          error: error.message || 'Failed to delete product',
          success: false,
        };
      }
    }
}
