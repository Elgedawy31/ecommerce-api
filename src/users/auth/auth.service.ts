import {  Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ResponseShape } from 'src/interfaces/response.interface';
import { Users } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_MODEL') private userModel: Model<Users>) {}

  async signIn(): Promise<ResponseShape> {
    const users = await this.userModel.find()
    return {
      data:'',
      success: true,
    };
  }
 
}