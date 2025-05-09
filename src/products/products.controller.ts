import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ResponseShape } from "src/interfaces/response.interface";
import { RolesDecorator } from "src/guards/roles.decorator";
import { UsersGuard } from "src/guards/authentization.guard";
import { CreateProductDto } from "./dto/create.product.dto";
import { UpdateProductDto } from "./dto/update.product.dto";

@Controller('products')
export class ProductsController{
  constructor(private readonly ProductsService:ProductsService){}
@RolesDecorator(['admin' , 'user'])
  @UseGuards(UsersGuard)
  @Get()
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResponseShape> {
    try {
      return this.ProductsService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  @RolesDecorator(['admin','user'])
  @UseGuards(UsersGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<ResponseShape> {
    try {
      return this.ProductsService.getProduct(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Post()
  async create(@Body() body: CreateProductDto): Promise<ResponseShape> {
    try {
      return await this.ProductsService.createProduct(body);
    } catch (error) {
      // Provide more specific error message
      const errorMessage = error.message || 'Failed to create product';
      throw new HttpException(
        {
          message: errorMessage,
          error: error.name || 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Patch(':id')
  async updateUser(
    @Body() body: UpdateProductDto,
    @Param('id') id: string,
  ): Promise<ResponseShape> {
    try {
      return await this.ProductsService.updateProduct(id, body);
    } catch (error) {
      // Provide more specific error message
      const errorMessage = error.message || 'Failed to update product';
      throw new HttpException(
        {
          message: errorMessage,
          error: error.name || 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ): Promise<ResponseShape> {
    try {
      return await this.ProductsService.deleteProduct(id);
    } catch (error) {
      // Provide more specific error message
      const errorMessage = error.message || 'Failed to delete product';
      throw new HttpException(
        {
          message: errorMessage,
          error: error.name || 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}