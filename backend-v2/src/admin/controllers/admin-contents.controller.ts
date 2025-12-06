// @ts-nocheck
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

  // ✅ تست ساده
  @Get('test')
  @Render('test')
  test() {
    return { message: 'Admin test successful - Handlebars is working' };
  }

  // ✅ تست با Layout ساده
  @Get('test-layout')
  @Render('simple-layout')
  testWithLayout() {
    return { 
      title: 'تست Layout',
      body: '<p>این یک تست با Layout ساده است.</p><a href="/admin/contents">برو به لیست محتواها</a>'
    };
  }

  // ✅ تست JSON (بدون View)
  @Get('test-json')
  testJson() {
    return { 
      status: 'success', 
      message: 'Admin JSON endpoint is working',
      timestamp: new Date().toISOString()
    };
  }

  // 📋 لیست محتواها - نسخه ساده
  @Get('contents')
  @Render('simple-contents-list')
  async listContents(@Query() query: any) {
    try {
      const contents = await this.contentService.findAll(query);
      return { 
        success: true,
        contents,
        filters: {
          type: query.type || '',
          status: query.status || ''
        }
      };
    } catch (error) {
      return { 
        success: false,
        error: error.message,
        contents: [],
        filters: {}
      };
    }
  }

  // ➕ فرم ایجاد محتوا - نسخه ساده
  @Get('contents/new')
  @Render('simple-content-create')
  createForm(@Query('error') error?: string) {
    return { 
      success: true,
      contentTypes: [
        'article', 'news', 'landing', 'landing_market', 
        'product_showcase', 'faq_page', 'static_page'
      ],
      statusTypes: ['draft', 'published', 'archived'],
      error: error || null
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

  // ✏️ فرم ویرایش - نسخه ساده
  @Get('contents/:id/edit')
  @Render('simple-content-edit')
  async editForm(@Param('id') id: string) {
    try {
      const content = await this.contentService.findOne(+id);
      if (!content) {
        throw new NotFoundException('Content not found');
      }

      return {
        success: true,
        content,
        contentTypes: [
          'article', 'news', 'landing', 'landing_market', 
          'product_showcase', 'faq_page', 'static_page'
        ],
        statusTypes: ['draft', 'published', 'archived']
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: null,
        contentTypes: [],
        statusTypes: []
      };
    }
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

  // 👁️ پیش‌نمایش - نسخه ساده
  @Get('contents/:id/preview')
  @Render('simple-content-preview')
  async preview(@Param('id') id: string, @Query('locale') locale: string = 'fa') {
    try {
      const content = await this.contentService.findOne(+id);
      if (!content) {
        throw new NotFoundException('Content not found');
      }

      const bodyHtml = await this.blockRenderer.renderBlocks(content.blocks);
      return { 
        success: true,
        content, 
        bodyHtml, 
        locale 
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: null,
        bodyHtml: '',
        locale: 'fa'
      };
    }
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
