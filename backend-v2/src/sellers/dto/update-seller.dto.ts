import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  nameZh?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  nameFa?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  companyName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  contactPerson?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  wechatId?: string;

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
}
