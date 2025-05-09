import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './interfaces/user.interface';
import { ResponseShape } from 'src/interfaces/response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesDecorator } from 'src/guards/roles.decorator';
import { UsersGuard } from 'src/guards/authentization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly UserServices: UsersService) {}

  @RolesDecorator(['admin', 'user'])
  @UseGuards(UsersGuard)
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
  @RolesDecorator(['admin'])
  @UseGuards(UsersGuard)
  @Post()
  async create(@Body() body: CreateUserDto): Promise<ResponseShape> {
    try {
      return await this.UserServices.createUser(body);
    } catch (error) {
      // Provide more specific error message
      const errorMessage = error.message || 'Failed to create user';
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
