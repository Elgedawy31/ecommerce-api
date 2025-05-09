import { Controller, Get, Query } from "@nestjs/common";
import { ResponseShape } from "src/interfaces/response.interface";
import { CategoriesService } from "./categories.service";

@Controller('categories')
export class CategoriesController{
  constructor(private readonly CategoriesService:CategoriesService){}

  @Get()
  getAll(@Query('page') page:number , @Query('limit') limit:number):Promise<ResponseShape>{
    return this.CategoriesService.getAllCategories()
    
  }
}