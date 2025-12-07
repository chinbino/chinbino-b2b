import { IsOptional, IsString, IsNumber, IsEnum, IsInt } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  min_order?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
