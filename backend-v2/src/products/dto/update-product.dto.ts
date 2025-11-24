import { IsString, IsNumber, IsPositive, Min, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsPositive()
  @Min(1)
  stockQuantity: number;

  // فیلدهای جدید کارتن
  @IsNumber()
  @IsPositive()
  @Min(1)
  unitsPerCarton: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  minOrderCartons: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  minOrderUnits: number;

  @IsNumber()
  @IsPositive()
  cartonWeightKg: number;

  @IsNumber()
  @IsPositive()
  cartonVolumeM3: number;
}
