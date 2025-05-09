import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DatabaseModule } from "../database/database.module";
import { usersProviders } from "./users.provider";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/users/auth/auth.module";

@Module({
  imports:[
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ] ,
  controllers:[UsersController] , 
  providers:[UsersService, ...usersProviders], 
  exports:[]
})
export class UsersModule{}
