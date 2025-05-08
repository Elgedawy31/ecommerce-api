import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Users } from "./interfaces/user.interface";

@Controller('users')

export class UsersController {
  constructor(private readonly UserServices:UsersService){}
  @Get()
  getUsers():Promise<Users[]>{
    return this.UserServices.findAll()
  }
}
