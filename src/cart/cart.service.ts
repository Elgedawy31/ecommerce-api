import { Inject, Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { Cart, CartItem } from "./interfaces/cart.interface";
import { ResponseShape } from "src/interfaces/response.interface";

@Injectable()
export class CartService {
  constructor(@Inject('CART_MODEL') private CartModel: Model<Cart>) {}

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseShape> {
    try {
      const skip = (page - 1) * limit;
      const totalCarts = await this.CartModel.countDocuments();
      const carts = await this.CartModel.find().skip(skip).limit(limit).exec();
      const totalPages = Math.ceil(totalCarts / limit) || 0;
      
      return {
        page,
        limit,
        data: carts,
        total: totalCarts,
        totalPages,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch carts',
        success: false,
      };
    }
  }

  async getCart(id: string): Promise<ResponseShape> {
    try {
      const cart = await this.CartModel.findById(id);
      
      if (!cart) {
        return {
          data: null,
          error: `Cart with ID ${id} not found`,
          success: false,
        };
      }
      
      return {
        data: cart,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch cart',
        success: false,
      };
    }
  }

  async getUserCart(userId: string): Promise<ResponseShape> {
    try {
      const cart = await this.CartModel.findOne({ userId: new Types.ObjectId(userId) });
      
      if (!cart) {
        return {
          data: null,
          error: `Cart for user ${userId} not found`,
          success: false,
        };
      }
      
      return {
        data: cart,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch user cart',
        success: false,
      };
    }
  }

  async createCart(userId: string, items: CartItem[]): Promise<ResponseShape> {
    try {
      // Calculate total price
      const totalPrice = items.reduce((sum, item) => sum + item.total, 0);
      
      const cart = new this.CartModel({
        userId: new Types.ObjectId(userId),
        items,
        totalPrice
      });
      
      const createdCart = await cart.save();
      
      return {
        data: createdCart,
        message: 'Cart created successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to create cart',
        success: false,
      };
    }
  }

  async updateCart(id: string, items: CartItem[]): Promise<ResponseShape> {
    try {
      // Check if cart exists
      const existingCart = await this.CartModel.findById(id);
      
      if (!existingCart) {
        return {
          data: null,
          error: `Cart with ID ${id} not found`,
          success: false,
        };
      }
      
      // Calculate total price
      const totalPrice = items.reduce((sum, item) => sum + item.total, 0);
      
      const updatedCart = await this.CartModel.findByIdAndUpdate(
        id,
        { items, totalPrice },
        { new: true }
      );
      
      return {
        data: updatedCart,
        message: 'Cart updated successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to update cart',
        success: false,
      };
    }
  }

  async addItemToCart(userId: string, item: CartItem): Promise<ResponseShape> {
    try {
      // Find user's cart
      let cart = await this.CartModel.findOne({ userId: new Types.ObjectId(userId) });
      
      // If cart doesn't exist, create a new one
      if (!cart) {
        return this.createCart(userId, [item]);
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        cartItem => cartItem.productId.toString() === item.productId.toString()
      );
      
      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += item.quantity;
        cart.items[existingItemIndex].total = cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
      } else {
        // Add new item
        cart.items.push(item);
      }
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((sum, cartItem) => sum + cartItem.total, 0);
      
      // Save updated cart
      const updatedCart = await cart.save();
      
      return {
        data: updatedCart,
        message: 'Item added to cart successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to add item to cart',
        success: false,
      };
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<ResponseShape> {
    try {
      // Find user's cart
      const cart = await this.CartModel.findOne({ userId: new Types.ObjectId(userId) });
      
      if (!cart) {
        return {
          data: null,
          error: `Cart for user ${userId} not found`,
          success: false,
        };
      }
      
      // Remove item from cart
      const initialItemsCount = cart.items.length;
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      
      // If no items were removed
      if (initialItemsCount === cart.items.length) {
        return {
          data: cart,
          error: `Product ${productId} not found in cart`,
          success: false,
        };
      }
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
      
      // Save updated cart
      const updatedCart = await cart.save();
      
      return {
        data: updatedCart,
        message: 'Item removed from cart successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to remove item from cart',
        success: false,
      };
    }
  }

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<ResponseShape> {
    try {
      // Find user's cart
      const cart = await this.CartModel.findOne({ userId: new Types.ObjectId(userId) });
      
      if (!cart) {
        return {
          data: null,
          error: `Cart for user ${userId} not found`,
          success: false,
        };
      }
      
      // Find item in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (itemIndex === -1) {
        return {
          data: cart,
          error: `Product ${productId} not found in cart`,
          success: false,
        };
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
      
      // Save updated cart
      const updatedCart = await cart.save();
      
      return {
        data: updatedCart,
        message: 'Cart item quantity updated successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to update cart item quantity',
        success: false,
      };
    }
  }

  async clearCart(userId: string): Promise<ResponseShape> {
    try {
      // Find user's cart
      const cart = await this.CartModel.findOne({ userId: new Types.ObjectId(userId) });
      
      if (!cart) {
        return {
          data: null,
          error: `Cart for user ${userId} not found`,
          success: false,
        };
      }
      
      // Clear cart items
      cart.items = [];
      cart.totalPrice = 0;
      
      // Save updated cart
      const updatedCart = await cart.save();
      
      return {
        data: updatedCart,
        message: 'Cart cleared successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to clear cart',
        success: false,
      };
    }
  }

  async deleteCart(id: string): Promise<ResponseShape> {
    try {
      const cart = await this.CartModel.findById(id);
      
      if (!cart) {
        return {
          data: null,
          error: `Cart with ID ${id} not found`,
          success: false,
        };
      }
      
      const deletedCart = await this.CartModel.findByIdAndDelete(id);
      
      return {
        data: deletedCart,
        message: 'Cart deleted successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to delete cart',
        success: false,
      };
    }
  }
}
