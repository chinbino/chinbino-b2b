// src/suppliers/dto/create-supplier.dto.ts
import { IsString, IsEmail, IsOptional, MinLength, IsIn } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(2)
  companyName: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsIn(['iran', 'china'])
  country: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  businessLicenseNumber?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  // از User گرفته می‌شه
  userId: string;
}
