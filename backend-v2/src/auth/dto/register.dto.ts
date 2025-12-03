// src/auth/dto/register.dto.ts - کد کامل
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEnum(['buyer', 'seller', 'admin']) // ✅ admin اضافه شد
  @IsOptional()
  role?: 'buyer' | 'seller' | 'admin';
}
