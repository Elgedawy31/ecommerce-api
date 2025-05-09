import { Get, Inject, Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './interfaces/user.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<Users>) {}

  async findAll(page: number, limit: number): Promise<ResponseShape> {
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
  }
  async createUser(body: CreateUserDto): Promise<ResponseShape> {
    const { password } = body;
    const hashedPassword = await bcrypt.hash(password, 10); // Added salt rounds and await
    const user = new this.userModel({ ...body, password: hashedPassword });
    const createdUser = await user.save();
    return {
      data: createdUser,
      message: 'user created successfully',
      success: true,
    };
  }
}
