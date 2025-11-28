import { IsEnum, IsNotEmpty, IsObject, IsArray, IsOptional, IsString, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType, ContentStatus } from '../entities/content.entity';

class SeoDto {
  @IsOptional()
  @IsObject()
  metaTitle?: Record<string, string>;

  @IsOptional()
  @IsObject()
  metaDescription?: Record<string, string>;

  @IsOptional()
  @IsUrl()
  canonical?: string;

  @IsOptional()
  @IsString()
  robots?: string;

  @IsOptional()
  @IsString()
  ogImageId?: string;
}

export class CreateContentDto {
  @IsEnum(ContentType)
  type: ContentType;

  @IsObject()
  @IsNotEmpty()
  title: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus = ContentStatus.DRAFT;

  @IsOptional()
  @IsObject()
  excerpt?: Record<string, string>;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  locales?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;

  @IsOptional()
  @IsString()
  mainImageId?: string;

  @IsArray()
  @IsNotEmpty()
  blocks: any[];
}
