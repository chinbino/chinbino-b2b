// backend-v2/src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  titleFa: string;

  @IsString()
  @IsOptional()
  titleZh?: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  descriptionFa?: string;

  @IsNumber()
  @Min(0)
  basePriceCNY: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockUnit?: number;
}
