import { Controller, Get } from "@nestjs/common";
import { CartService } from "./cart.service";

@Controller('cart')

export class CartController{
  constructor(private readonly CartService:CartService){}
  @Get()
  getAll(){
    return this.CartService.getAll()
  }
}