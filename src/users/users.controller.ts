import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './interfaces/user.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly UserServices: UsersService) {}
  @Get()
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ResponseShape> {
    try {
      return this.UserServices.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  create(@Body() body: CreateUserDto): Promise<ResponseShape> {
   try {
     return this.UserServices.createUser(body);
   } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    
   }
  }
}
