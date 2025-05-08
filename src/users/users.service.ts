import { Get, Inject, Injectable, Query } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './interfaces/user.interface';
import { ResponseShape } from 'src/interfaces/response.interface';

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
    };
  }
}
