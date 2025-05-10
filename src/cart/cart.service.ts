import { Injectable } from "@nestjs/common";

@Injectable()
export class CartService{
  constructor(){}
  async getAll(){
    return 'get all carts'
  }
}