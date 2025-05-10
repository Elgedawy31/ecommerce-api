import { 
  Controller, 
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartItem } from "./interfaces/cart.interface";
import { UsersGuard } from "src/guards/authentization.guard";

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @UseGuards(UsersGuard)
  @Get()
  async getCart(@Query('userId') userId: string) {
    return this.CartService.getCartByUserId(userId);
  }

  @UseGuards(UsersGuard)
  @Post()
  async addItemToCart(
    @Query('userId') userId: string,
    @Body() cartItem: CartItem
  ) {
    return this.CartService.addItemToCart(userId, cartItem);
  }

  @UseGuards(UsersGuard)
  @Put('item/:productId')
  async updateCartItemQuantity(
    @Query('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number
  ) {
    return this.CartService.updateCartItemQuantity(userId, productId, quantity);
  }

  @UseGuards(UsersGuard)
  @Delete('item/:productId')
  async removeItemFromCart(
    @Query('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.CartService.removeItemFromCart(userId, productId);
  }

  @UseGuards(UsersGuard)
  @Delete()
  async clearCart(@Query('userId') userId: string) {
    return this.CartService.clearCart(userId);
  }
}
