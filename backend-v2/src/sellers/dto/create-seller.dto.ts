import { 
  IsString, 
  IsOptional, 
  Length, 
  Matches, 
  IsEmail,
  IsEnum 
} from 'class-validator';
import { SellerStatus } from '../entities/seller.entity';

export class CreateSellerDto {
  @IsString()
  @Length(2, 255)
  nameZh: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  nameFa?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  companyName?: string;

  // 🔴 فیلدهای جدید
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  contactName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Contact phone must be a valid international phone number'
  })
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  wechatId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  contactPerson?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be a valid international phone number'
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  aliwangwangId?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  location?: string;

  @IsOptional()
  @IsString()
  descriptionZh?: string;

  @IsOptional()
  @IsString()
  descriptionFa?: string;

  // 🔴 email validation (اگر اضافه شود)
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 255)
  contactEmail?: string;
}
