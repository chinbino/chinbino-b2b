import { IsOptional, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  titleFa?: string;

  @IsOptional()
  @IsString()
  titleZh?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  descriptionFa?: string;

  @IsOptional()
  @IsString()
  descriptionZh?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePriceCNY?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePriceIRR?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePriceUSD?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  stockUnit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  unitsPerCarton?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  minOrderCartons?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  minOrderUnits?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cartonWeightKg?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cartonVolumeM3?: number;
}
