import { Controller, Get, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController{
  constructor(private readonly ProductsService:ProductsService){}
  @Get()
  getAll(@Query('page') page:number , @Query('limit') limit:number){
    return this.ProductsService.findAll(page , limit)
  }
}