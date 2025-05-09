import { Get, Inject, Injectable, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './interfaces/user.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<Users>) {}

  async findAll(page: number, limit: number): Promise<ResponseShape> {
    try {
      const skip = (page - 1) * limit;
      const totalUsers = await this.userModel.countDocuments();
      const users = await this.userModel.find().skip(skip).limit(limit).exec();
      return {
        page,
        limit,
        data: users,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch users',
        success: false,
      };
    }
  }
  async createUser(body: CreateUserDto): Promise<ResponseShape> {
    try {
      const { password } = body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ ...body, password: hashedPassword });
      const createdUser = await user.save();
      return {
        data: createdUser,
        message: 'user created successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to create user',
        success: false,
      };
    }
  }
  async updateUser(id: string, body: UpdateUserDto): Promise<ResponseShape> {
    try {
      // Check if user exists
      const existingUser = await this.userModel.findById(id);
      if (!existingUser) {
        return {
          data: null,
          error: `User with ID ${id} not found`,
          success: false,
        };
      }

      const { password } = body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { ...body, password: hashedPassword };
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      
      return {
        data: updatedUser,
        message: 'user updated successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to update user',
        success: false,
      };
    }
  }
  async getUser(id: string): Promise<ResponseShape> {
    try {
      const user = await this.userModel.findById(id);
      
      if (!user) {
        return {
          data: null,
          error: `User with ID ${id} not found`,
          success: false,
        };
      }
      
      return {
        data: user,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to fetch user',
        success: false,
      };
    }
  }
  async deleteUser(id: string): Promise<ResponseShape> {
    try {
      const user = await this.userModel.findById(id);
      
      if (!user) {
        return {
          data: null,
          error: `User with ID ${id} not found`,
          success: false,
        };
      }
      
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      
      return {
        data: deletedUser,
        message: 'user deleted successfully',
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: error.message || 'Failed to delete user',
        success: false,
      };
    }
  }
}
