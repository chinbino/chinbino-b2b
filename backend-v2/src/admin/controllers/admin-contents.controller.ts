import { Controller, Get, Post, Put, Param, Body, Query, Res, Render, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from '../../cms/services/content.service';
import { BlockRendererService } from '../../cms/services/block-renderer.service';
import { CreateContentDto } from '../../cms/dto/create-content.dto';

@Controller('admin')
export class AdminContentsController {
  constructor(
    private readonly contentService: ContentService,
    private readonly blockRenderer: BlockRendererService,
  ) {}

  // 📋 لیست محتواها
  @Get('contents')
  @Render('admin/contents-list')
  async listContents(@Query() query: any) {
    const contents = await this.contentService.findAll(query);
    return { 
      contents,
      filters: {
        type: query.type || '',
        status: query.status || ''
      }
    };
  }

  // ➕ فرم ایجاد محتوا
  @Get('contents/new')
  @Render('admin/content-create')
  createForm() {
    return { 
      contentTypes: [
        'article', 'news', 'landing', 'landing_market', 
        'product_showcase', 'faq_page', 'static_page'
      ],
      statusTypes: ['draft', 'published', 'archived']
    };
  }

  // ✅ ایجاد محتوا
  @Post('contents')
  async createContent(@Body() body: any, @Res() res: Response) {
    try {
      const createDto: CreateContentDto = {
        type: body.type,
        title: { fa: body.title_fa, en: body.title_en || '' },
        slug: body.slug,
        status: body.status,
        excerpt: { fa: body.excerpt_fa, en: body.excerpt_en || '' },
        categories: body.categories ? body.categories.split(',').map((c: string) => c.trim()) : [],
        tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
        locales: body.locales || ['fa'],
        seo: {
          metaTitle: { fa: body.meta_title_fa, en: body.meta_title_en || '' },
          metaDescription: { fa: body.meta_description_fa, en: body.meta_description_en || '' },
          robots: body.robots || 'index,follow'
        },
        blocks: body.blocks ? JSON.parse(body.blocks) : []
      };

      await this.contentService.create(createDto, 'admin-user-id');
      res.redirect('/admin/contents');
    } catch (error) {
      res.redirect('/admin/contents/new?error=' + encodeURIComponent(error.message));
    }
  }

  // ✏️ فرم ویرایش
  @Get('contents/:id/edit')
  @Render('admin/content-edit')
  async editForm(@Param('id') id: string) {
    const content = await this.contentService.findOne(+id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return {
      content,
      contentTypes: [
        'article', 'news', 'landing', 'landing_market', 
        'product_showcase', 'faq_page', 'static_page'
      ],
      statusTypes: ['draft', 'published', 'archived']
    };
  }

  // ✅ آپدیت محتوا
  @Post('contents/:id/edit')
  async updateContent(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const updateData = {
        type: body.type,
        title: { fa: body.title_fa, en: body.title_en || '' },
        slug: body.slug,
        status: body.status,
        excerpt: { fa: body.excerpt_fa, en: body.excerpt_en || '' },
        categories: body.categories ? body.categories.split(',').map((c: string) => c.trim()) : [],
        tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
        locales: body.locales || ['fa'],
        seo: {
          metaTitle: { fa: body.meta_title_fa, en: body.meta_title_en || '' },
          metaDescription: { fa: body.meta_description_fa, en: body.meta_description_en || '' },
          robots: body.robots || 'index,follow'
        },
        blocks: body.blocks ? JSON.parse(body.blocks) : []
      };

      await this.contentService.update(+id, updateData, 'admin-user-id');
      res.redirect('/admin/contents');
    } catch (error) {
      res.redirect(`/admin/contents/${id}/edit?error=` + encodeURIComponent(error.message));
    }
  }

  // 👁️ پیش‌نمایش
  @Get('contents/:id/preview')
  @Render('admin/content-preview')
  async preview(@Param('id') id: string, @Query('locale') locale: string = 'fa') {
    const content = await this.contentService.findOne(+id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const bodyHtml = await this.blockRenderer.renderBlocks(content.blocks);
    return { content, bodyHtml, locale };
  }

  // 🔍 JSON View (برای دیباگ)
  @Get('contents/:id/json')
  async getJson(@Param('id') id: string) {
    const content = await this.contentService.findOne(+id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }
}
