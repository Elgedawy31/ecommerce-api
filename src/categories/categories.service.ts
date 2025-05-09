import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { CategoriesInterface } from "./interfaces/categories.interfaces";
import { ResponseShape } from "src/interfaces/response.interface";

@Injectable()

export class CategoriesService{
  constructor(@Inject('CATEGORIES_MODEL') private CategoriesService: Model<CategoriesInterface>){}

  async getAllCategories(page:number = 1 , limit:number=10 ):Promise<ResponseShape>{

     const skip = (page - 1) * limit;
    const totalProducts = await this.CategoriesService.countDocuments();
    const Products = await this.CategoriesService.find().skip(skip).limit(limit).exec();
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
}