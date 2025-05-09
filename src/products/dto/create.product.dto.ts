import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsArray, ArrayMinSize, IsMongoId, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Product name must be at least 3 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(15, { message: 'Description must be at least 15 characters.' })
  description: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @IsPositive({ message: 'Stock must be a positive number.' })
  stock: number;

  @IsArray()
  @IsString({ each: true, message: 'Each image must be a string URL.' })
  @ArrayMinSize(0)
  images: string[];

  @IsMongoId({ message: 'Invalid category ID format.' })
  categoryId: string;
}
