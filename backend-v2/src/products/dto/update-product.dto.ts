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

  @IsString()
  @IsOptional()
  descriptionZh?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePriceCNY?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePriceIRR?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockUnit?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  externalCode?: string;
}
