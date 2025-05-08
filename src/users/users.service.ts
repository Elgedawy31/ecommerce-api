import { Get, Injectable } from "@nestjs/common";

@Injectable()

export class UsersService{
  constructor(){}

  findAll():string{
    return 'get all users'
  }

}