import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dto/create-content.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Content } from '../entities/content.entity';

@Controller('api/contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createContentDto: CreateContentDto,
    @Request() req,
  ): Promise<Content> {
    try {
      return await this.contentService.create(createContentDto, req.user.id);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new HttpException('Slug already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string): Promise<Content> {
    return await this.contentService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Content>,
    @Request() req,
  ): Promise<Content> {
    try {
      return await this.contentService.update(parseInt(id), updateData, req.user.id);
    } catch (error) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }
  }
}
