import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { CategoriesInterface } from "./interfaces/categories.interfaces";
import { ResponseShape } from "src/interfaces/response.interface";
import { CreateCategoryDto } from "./dto/create.category.dto";
import { updateCategoryDto } from "./dto/update.category.dto";

@Injectable()

export class CategoriesService{
  constructor(@Inject('CATEGORIES_MODEL') private CategoriesService: Model<CategoriesInterface>){}

  async getAllCategories(page:number = 1 , limit:number=10 ):Promise<ResponseShape>{

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

  }

  async createCategory(body: CreateCategoryDto): Promise<ResponseShape> {
      const Category = new this.CategoriesService(body);
      const createdCategory = await Category.save();
      return {
        data: createdCategory,
        message: 'Category created successfully',
        success: true,
      };
    }
      async updateCategory(id: string, body: updateCategoryDto): Promise<ResponseShape> {
        const updatedCategory = await this.CategoriesService.findByIdAndUpdate(id, body, {
          new: true,
        });
        return {
          data: updatedCategory,
          message: 'Category updated successfully',
          success: true,
        };
      }
      async getCategory(id: string): Promise<ResponseShape> {
        const Category = await this.CategoriesService.findById(id);
        return {
          data: Category,
          success: true,
        };
      }
      async deleteCategory(id: string): Promise<ResponseShape> {
        const Category = await this.CategoriesService.findByIdAndDelete(id);
        return {
          data: Category,
          message: 'Category deleted successfully',
          success: true,
        };
      }
}