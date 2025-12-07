import { IsString, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(1)
  min_order: number;

  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.ACTIVE;
}
