import { Get, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<Users>) {}

  findAll(): Promise<Users[]> {
    return this.userModel.find();
  }
}
