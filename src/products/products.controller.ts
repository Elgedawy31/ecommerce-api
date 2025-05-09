import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create.product.dto";
import { ResponseShape } from "src/interfaces/response.interface";

@Controller('products')
export class ProductsController{
  constructor(private readonly ProductsService:ProductsService){}
  @Get()
  getAll(@Query('page') page:number , @Query('limit') limit:number){
    return this.ProductsService.findAll(page , limit)
  }

  @Post()
  create(@Body() body:CreateProductDto):Promise <ResponseShape | null>{
    return this.ProductsService.createProduct(body)
  }
}