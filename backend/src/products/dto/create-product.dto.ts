import { IsNotEmpty, IsNumber, IsString, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name_zh: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  name_fa: string;

  @IsString()
  description_zh: string;

  @IsString()
  description_fa: string;

  @IsNumber()
  @Min(0.01)
  weight_kg: number;

  @IsNumber()
  @Min(0.001)
  volume_cbm: number;

  @IsNumber()
  @Min(1)
  items_per_carton: number;

  @IsNumber()
  @Min(0.01)
  price_cny: number;

  @IsNotEmpty()
  @IsString()
  market_name: string;

  @IsNotEmpty()
  @IsString()
  booth_number: string;

  @IsString()
  supplier_code: string;
}
