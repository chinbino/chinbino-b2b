import { IsArray, IsObject, IsOptional } from 'class-validator';

export class RenderContentDto {
  @IsArray()
  blocks: any[];

  @IsObject()
  @IsOptional()
  seo?: any;
}
