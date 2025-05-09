import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService{
  async getAllProducts(){
    return 'get all products'
  }
}