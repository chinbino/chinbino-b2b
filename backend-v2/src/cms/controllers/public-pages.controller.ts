import { Controller, Get, Query, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from '../services/content.service';
import { BlockRendererService } from '../services/block-renderer.service';

@Controller() // بدون prefix - routeهای روت
export class PublicPagesController {
  constructor(
    private readonly contentService: ContentService,
    private readonly blockRenderer: BlockRendererService,
  ) {}

  /**
   * صفحه public برای Yiwu Market
   */
  @Get('yiwu-market')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async yiwuMarket(
    @Query('locale') locale: string = 'fa',
    @Res() res: Response,
  ): Promise<void> {
    try {
      // پیدا کردن محتوای Yiwu Market بر اساس slug
      const content = await this.contentService.findBySlug('yiwu-market');
      
      if (!content) {
        // اگر محتوا پیدا نشد، صفحه 404 نمایش داده شود
        const notFoundHtml = this.generateNotFoundPage('yiwu-market', locale);
        res.status(404).send(notFoundHtml);
        return;
      }

      // رندر بلوک‌ها به HTML
      const bodyHtml = this.blockRenderer.renderBlocks(content.blocks, locale);
      
      // آماده‌سازی اطلاعات SEO
      const seo = content.seo || {};
      const metaTitle = this.getLocalizedValue(seo.metaTitle, locale) || 
                       this.getLocalizedValue(content.title, locale) || 
                       'بازار فوتین - Yiwu Market';
      
      const metaDescription = this.getLocalizedValue(seo.metaDescription, locale) || 
                             this.getLocalizedValue(content.excerpt, locale) || 
                             'تامین مستقیم از بازار ییوو چین - Chinbino B2B Platform';
      
      const robots = seo.robots || 'index,follow';

      // تولید HTML کامل
      const html = this.generateFullPage({
        metaTitle,
        metaDescription,
        robots,
        bodyHtml,
        locale,
        content
      });

      res.send(html);

    } catch (error) {
      console.error('Error rendering Yiwu Market page:', error);
      const errorHtml = this.generateErrorPage(error.message, locale);
      res.status(500).send(errorHtml);
    }
  }

  // ... بقیه متدها بدون تغییر (generateFullPage, generateNotFoundPage, etc.)
  // همه متدهای helper را حفظ کنید
}
