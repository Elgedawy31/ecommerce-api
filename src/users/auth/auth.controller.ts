import { Body, Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('auth')

export class  AuthController{
  constructor(private readonly AuthService: AuthService) {}

  @Get()
  signIn(@Body() body:any){
    return this.AuthService.signIn()
  }
}