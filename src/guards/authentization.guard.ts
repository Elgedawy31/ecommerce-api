import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesDecorator } from './roles.decorator';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private reflector: Reflector , private jwtService:JwtService) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(RolesDecorator, context.getHandler());
    if(!roles){
        return true
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if(!token){
        throw new  UnauthorizedException('Token not found')
    }

    try {
        const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

        const userRole = decodedToken['role'];
        const hasRole = () => roles.includes(userRole);
        if (!hasRole()) {
            throw new UnauthorizedException('You do not have permission to access this resource');
        }else{
            return true
        }
        
        
    } catch (error) {
        throw new UnauthorizedException('Invalid token')
        
    }

  }
}
