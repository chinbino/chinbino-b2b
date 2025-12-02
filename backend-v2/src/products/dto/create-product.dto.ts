import { 
  IsString, 
  IsNumber, 
  IsPositive, 
  Min, 
  IsOptional, 
  IsArray 
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  titleFa: string; // تغییر: name → titleFa

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

  @IsNumber()
  @IsPositive()
  basePriceCNY: number; // تغییر: price → basePriceCNY

  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePriceIRR?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  basePriceUSD?: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  stockUnit: number; // تغییر: stockQuantity → stockUnit

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

  // فیلدهای اضافه برای هماهنگی
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}
