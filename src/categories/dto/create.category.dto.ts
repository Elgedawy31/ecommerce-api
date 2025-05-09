import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsArray, ArrayMinSize, IsMongoId, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Category name must be at least 3 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(15, { message: 'Description must be at least 15 characters.' })
  description: string;

 
}
