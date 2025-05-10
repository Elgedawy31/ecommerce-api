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
import { OrdersService } from "./orders.service";
import { ResponseShape } from "src/interfaces/response.interface";
import { RolesDecorator } from "src/guards/roles.decorator";
import { UsersGuard } from "src/guards/authentization.guard";
import { CreateOrderDto } from "./dto/create.order.dto";
import { UpdateOrderDto } from "./dto/update.order.dto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Get()
  getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResponseShape> {
    try {
      return this.OrdersService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Get('user/:userId')
  getUserOrders(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResponseShape> {
    try {
      return this.OrdersService.getOrdersByUser(userId, page, limit);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Get(':id')
  getOrder(@Param('id') id: string): Promise<ResponseShape> {
    try {
      return this.OrdersService.getOrder(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
  @Post()
  async createOrder(
    @Body() body: CreateOrderDto
  ): Promise<ResponseShape> {
    try {
      return await this.OrdersService.createOrder(body);
    } catch (error) {
      const errorMessage = error.message || 'Failed to create order';
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
  async updateOrder(
    @Body() body: UpdateOrderDto,
    @Param('id') id: string,
  ): Promise<ResponseShape> {
    try {
      return await this.OrdersService.updateOrder(id, body);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update order';
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
  @Patch(':id/status')
  async updateOrderStatus(
    @Body('status') status: string,
    @Param('id') id: string,
  ): Promise<ResponseShape> {
    try {
      return await this.OrdersService.updateOrderStatus(id, status);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update order status';
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
  async deleteOrder(
    @Param('id') id: string,
  ): Promise<ResponseShape> {
    try {
      return await this.OrdersService.deleteOrder(id);
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete order';
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
