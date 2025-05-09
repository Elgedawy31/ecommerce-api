import { Body, Controller, Get, HttpException, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResponseShape } from "src/interfaces/response.interface";
import { SignInDto } from "../dto/signin.dto";
import { SignUpDtop } from "../dto/signup.dto";


@Controller('auth')

export class  AuthController{
  constructor(private readonly AuthService: AuthService) {}

    @Post('login')
    async login(@Body(new ValidationPipe({whitelist:true})) body:SignInDto) : Promise<ResponseShape | null>{
        const {email , password} = body
        try {
            return await this.AuthService.signIn(email , password)
        } catch (error) {
            throw new  HttpException(error , HttpStatus.BAD_REQUEST)
        }
    }
    @Post('register')
    async register(@Body(new ValidationPipe({whitelist:true})) body:SignUpDtop) : Promise<ResponseShape | null>{
        try {
            return await this.AuthService.signUp(body)
        } catch (error) {
            throw new  HttpException(error , HttpStatus.BAD_REQUEST)
        }
    }
}