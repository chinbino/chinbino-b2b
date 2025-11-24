// backend-v2/src/products/dto/update-product.dto.ts
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  titleFa?: string;

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
  @IsOptional()
  basePriceCNY?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockUnit?: number;
}
