import { Inject, Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { Model } from "mongoose";
import { CategoriesInterface } from "./interfaces/categories.interfaces";
import { ResponseShape } from "src/interfaces/response.interface";
import { CreateCategoryDto } from "./dto/create.category.dto";
import { updateCategoryDto } from "./dto/update.category.dto";

@Injectable()

export class CategoriesService{
  constructor(@Inject('CATEGORIES_MODEL') private CategoriesService: Model<CategoriesInterface>){}

  async getAllCategories(page:number = 1 , limit:number=10 ):Promise<ResponseShape>{
    try {
      const skip = (page - 1) * limit;
      const totalCategorys = await this.CategoriesService.countDocuments();
      const Categorys = await this.CategoriesService.find().skip(skip).limit(limit).exec();
      const totalPages = Math.ceil(totalCategorys / limit) || 0;
      return {
        page,
        limit,
        data: Categorys,
        total: totalCategorys,
        totalPages,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch categories',
        success: false,
      };
    }
  }

  async createCategory(body: CreateCategoryDto): Promise<ResponseShape> {
    try {
      const Category = new this.CategoriesService(body);
      const createdCategory = await Category.save();
      return {
        data: createdCategory,
        message: 'Category created successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to create category',
        success: false,
      };
    }
  }
      async updateCategory(id: string, body: updateCategoryDto): Promise<ResponseShape> {
        try {
          // Check if category exists
          const existingCategory = await this.CategoriesService.findById(id);
          if (!existingCategory) {
            return {
              data: null,
              error: `Category with ID ${id} not found`,
              success: false,
            };
          }
          
          const updatedCategory = await this.CategoriesService.findByIdAndUpdate(id, body, {
            new: true,
          });
          return {
            data: updatedCategory,
            message: 'Category updated successfully',
            success: true,
          };
        } catch (error) {
          return {
            data: null,
            error: error.message || 'Failed to update category',
            success: false,
          };
        }
      }
      async getCategory(id: string): Promise<ResponseShape> {
        try {
          const category = await this.CategoriesService.findById(id);
          
          if (!category) {
            return {
              data: null,
              error: `Category with ID ${id} not found`,
              success: false,
            };
          }
          
          return {
            data: category,
            success: true,
          };
        } catch (error) {
          return {
            data: null,
            error: error.message || 'Failed to fetch category',
            success: false,
          };
        }
      }
      async deleteCategory(id: string): Promise<ResponseShape> {
        try {
          const category = await this.CategoriesService.findById(id);
          
          if (!category) {
            return {
              data: null,
              error: `Category with ID ${id} not found`,
              success: false,
            };
          }
          
          const deletedCategory = await this.CategoriesService.findByIdAndDelete(id);
          
          return {
            data: deletedCategory,
            message: 'Category deleted successfully',
            success: true,
          };
        } catch (error) {
          return {
            data: null,
            error: error.message || 'Failed to delete category',
            success: false,
          };
        }
      }
}
