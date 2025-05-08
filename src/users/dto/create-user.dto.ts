// create-user.dto.ts
import { IsString, IsEmail, IsOptional, MinLength, IsEnum, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({message:'Password is required'})
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;


  @IsNotEmpty({message:'Name is required'})
  @IsString({ message: 'Name must be a string.' })
  name: string;


  @IsNotEmpty({message:'Email is required'})
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Role must be either "user" or "admin".' })
  role?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string.' })
  address?: string;

  @IsOptional()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 and 15 digits.',
  })
  phone?: string;
}
