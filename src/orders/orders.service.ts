import { Inject, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_MODEL') private OrderModel: Model<Order>
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseShape> {
    try {
      const skip = (page - 1) * limit;
      const totalOrders = await this.OrderModel.countDocuments();
      const orders = await this.OrderModel.find().skip(skip).limit(limit).exec();
      const totalPages = Math.ceil(totalOrders / limit) || 0;
      return {
        page,
        limit,
        data: orders,
        total: totalOrders,
        totalPages,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch orders',
        success: false,
      };
    }
  }

  async createOrder(body: CreateOrderDto): Promise<ResponseShape> {
    try {
      // Calculate total for each item and validate
      const orderItems = body.items.map(item => ({
        ...item,
        total: item.price * item.quantity
      }));

      // Recalculate total price to ensure accuracy
      const calculatedTotalPrice = orderItems.reduce((sum, item) => sum + item.total, 0);
      
      const orderData = {
        ...body,
        items: orderItems,
        totalPrice: calculatedTotalPrice
      };
      
      const order = new this.OrderModel(orderData);
      const createdOrder = await order.save();
      
      return {
        data: createdOrder,
        message: 'Order created successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to create order',
        success: false,
      };
    }
  }

  async updateOrder(id: string, body: UpdateOrderDto): Promise<ResponseShape> {
    try {
      // Check if order exists
      const existingOrder = await this.OrderModel.findById(id);
      if (!existingOrder) {
        return {
          data: null,
          error: `Order with ID ${id} not found`,
          success: false,
        };
      }
      
      let updateData = { ...body };
      
      // If items are being updated, recalculate totals
      if (body.items) {
        const updatedItems = body.items.map(item => ({
          ...item,
          total: item.price * item.quantity
        }));
        
        updateData.items = updatedItems;
        
        // Recalculate total price if items changed
        if (!body.totalPrice) {
          updateData.totalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0);
        }
      }
      
      const updatedOrder = await this.OrderModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      
      return {
        data: updatedOrder,
        message: 'Order updated successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to update order',
        success: false,
      };
    }
  }

  async getOrder(id: string): Promise<ResponseShape> {
    try {
      const order = await this.OrderModel.findById(id);
      
      if (!order) {
        return {
          data: null,
          error: `Order with ID ${id} not found`,
          success: false,
        };
      }
      
      return {
        data: order,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch order',
        success: false,
      };
    }
  }

  async deleteOrder(id: string): Promise<ResponseShape> {
    try {
      const order = await this.OrderModel.findById(id);
      
      if (!order) {
        return {
          data: null,
          error: `Order with ID ${id} not found`,
          success: false,
        };
      }
      
      const deletedOrder = await this.OrderModel.findByIdAndDelete(id);
      
      return {
        data: deletedOrder,
        message: 'Order deleted successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to delete order',
        success: false,
      };
    }
  }

  async getOrdersByUser(userId: string, page: number = 1, limit: number = 10): Promise<ResponseShape> {
    try {
      const skip = (page - 1) * limit;
      const totalOrders = await this.OrderModel.countDocuments({ userId });
      const orders = await this.OrderModel.find({ userId }).skip(skip).limit(limit).exec();
      const totalPages = Math.ceil(totalOrders / limit) || 0;
      
      return {
        page,
        limit,
        data: orders,
        total: totalOrders,
        totalPages,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch user orders',
        success: false,
      };
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<ResponseShape> {
    try {
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      
      if (!validStatuses.includes(status)) {
        return {
          data: null,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          success: false,
        };
      }
      
      const order = await this.OrderModel.findById(id);
      
      if (!order) {
        return {
          data: null,
          error: `Order with ID ${id} not found`,
          success: false,
        };
      }
      
      const updatedOrder = await this.OrderModel.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true }
      );
      
      return {
        data: updatedOrder,
        message: `Order status updated to ${status}`,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to update order status',
        success: false,
      };
    }
  }
}
