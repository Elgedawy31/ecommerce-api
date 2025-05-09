import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseShape } from 'src/interfaces/response.interface';
import { SignUpDtop } from '../dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_MODEL') private userModel: Model<Users>,
    private JwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<ResponseShape | null> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.JwtService.signAsync(
      { id: user._id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET },
    );

    return {
      data: { user, token },
      message: 'user login successfully',
      success: true,
    };
  }
  async signUp(body: SignUpDtop): Promise<ResponseShape | null> {
    const { password } = body;
    const hashedPassword = await bcrypt.hash(password, 10); // Added salt rounds and await
    const user = new this.userModel({ ...body, password: hashedPassword });
    const createdUser = await user.save();
    const token = await this.JwtService.signAsync(
      { id: user._id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET },
    );

    return {
      data: { user: createdUser, token },
      message: 'user created successfully',
      success: true,
    };
  }
}
