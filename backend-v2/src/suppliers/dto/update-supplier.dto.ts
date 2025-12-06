// src/suppliers/dto/update-supplier.dto.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateSupplierDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsIn(['iran', 'china'])
  country?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  businessLicenseNumber?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pending', 'verified', 'rejected', 'suspended'])
  verificationStatus?: string;
}
