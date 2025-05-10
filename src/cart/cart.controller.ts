import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UseGuards
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { ResponseShape } from "src/interfaces/response.interface";
import { RolesDecorator } from "src/guards/roles.decorator";
import { UsersGuard } from "src/guards/authentization.guard";
import { CartItem } from "./interfaces/cart.interface";

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Get('all')
  getAllCarts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResponseShape> {
    try {
      return this.CartService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Get(':id')
  getCart(@Param('id') id: string): Promise<ResponseShape> {
    try {
      return this.CartService.getCart(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Get('user/:userId')
  getUserCart(@Param('userId') userId: string): Promise<ResponseShape> {
    try {
      return this.CartService.getUserCart(userId);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Post('user/:userId')
  async createCart(
    @Param('userId') userId: string,
    @Body() items: CartItem[]
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.createCart(userId, items);
    } catch (error) {
      const errorMessage = error.message || 'Failed to create cart';
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

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Patch(':id')
  async updateCart(
    @Param('id') id: string,
    @Body() items: CartItem[]
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.updateCart(id, items);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update cart';
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

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Post('user/:userId/item')
  async addItemToCart(
    @Param('userId') userId: string,
    @Body() item: CartItem
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.addItemToCart(userId, item);
    } catch (error) {
      const errorMessage = error.message || 'Failed to add item to cart';
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

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Delete('user/:userId/item/:productId')
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.removeItemFromCart(userId, productId);
    } catch (error) {
      const errorMessage = error.message || 'Failed to remove item from cart';
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

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Patch('user/:userId/item/:productId')
  async updateCartItemQuantity(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.updateCartItemQuantity(userId, productId, quantity);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update cart item quantity';
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

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Delete('user/:userId/clear')
  async clearCart(
    @Param('userId') userId: string
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.clearCart(userId);
    } catch (error) {
      const errorMessage = error.message || 'Failed to clear cart';
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
  async deleteCart(
    @Param('id') id: string
  ): Promise<ResponseShape> {
    try {
      return await this.CartService.deleteCart(id);
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete cart';
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
