import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')

export class UsersController {
  constructor(private readonly UserServices:UsersService){}
  @Get()
  getUsers(){
    return this.UserServices.findAll()
  }
}
