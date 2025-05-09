import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsPositive, 
  IsArray, 
  ValidateNested, 
  IsMongoId, 
  Min, 
  IsEnum, 
  IsOptional 
} from 'class-validator';
import { Type } from 'class-transformer';

// Item DTO for each product in the order
class OrderItemDto {
  @IsMongoId({ message: 'Invalid Product ID format.' })
  productId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name is required.' })
  name: string;

  @IsNumber()
  @IsPositive({ message: 'Product price must be a positive number.' })
  price: number;

  @IsNumber()
  @Min(1, { message: 'Product quantity must be at least 1.' })
  quantity: number;
}

// Shipping address DTO
class ShippingAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required.' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Street is required.' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required.' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code is required.' })
  postalCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required.' })
  country: string;
}

// Main Create Order DTO
export class CreateOrderDto {
  @IsMongoId({ message: 'Invalid User ID format.' })
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @IsPositive({ message: 'Total price must be a positive number.' })
  totalPrice: number;

  @IsEnum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], {
    message: 'Invalid order status.',
  })
  @IsOptional()
  status?: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
