import { Controller, Get, Param, Query, NotFoundException, Header } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { BlockRendererService } from '../services/block-renderer.service';

@Controller('api/render')
export class RenderController {
  constructor(
    private readonly contentService: ContentService,
    private readonly blockRenderer: BlockRendererService,
  ) {}

  @Get(':slug')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async renderBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'fa',
  ): Promise<string> {
    const content = await this.contentService.findBySlug(slug);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // ✅ آپدیت: حذف await و اضافه کردن پارامتر locale
    const bodyHtml = this.blockRenderer.renderBlocks(content.blocks, locale);

    const seo = content.seo || {};

    const metaTitle = seo.metaTitle?.[locale] || seo.metaTitle?.fa || content.title?.[locale] || content.title?.fa || '';
    const metaDescription = seo.metaDescription?.[locale] || seo.metaDescription?.fa || content.excerpt?.[locale] || content.excerpt?.fa || '';

    return `
<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="utf-8" />
    <title>${this.escapeHtml(metaTitle)}</title>
    <meta name="description" content="${this.escapeHtml(metaDescription)}" />
    <meta name="robots" content="${seo.robots || 'index,follow'}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- استایل‌های پیشرفته‌تر -->
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: ${locale === 'fa' ? 'Vazirmatn, Tahoma' : 'system-ui, -apple-system, sans-serif'}; 
            line-height: 1.6; 
            color: #333;
            background-color: #f8f9fa;
            direction: ${locale === 'fa' ? 'rtl' : 'ltr'};
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
        }
        
        .content-main {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 40px;
            margin: 20px auto;
            min-height: 500px;
        }
        
        /* استایل‌های برای بلوک‌های رندر شده */
        .content-heading {
            margin: 25px 0 15px 0 !important;
        }
        
        .content-paragraph {
            margin-bottom: 20px !important;
        }
        
        .content-hero {
            margin: 30px 0 !important;
        }
        
        .content-image {
            margin: 25px 0 !important;
        }
        
        .content-list {
            margin: 20px 0 !important;
        }
    </style>
    
    <!-- فونت Vazirmatn برای فارسی -->
    ${locale === 'fa' ? '<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />' : ''}
</head>
<body>
    <div class="container">
        <div class="content-main">
            ${bodyHtml}
        </div>
    </div>
    
    <footer style="background: #333; color: white; text-align: center; padding: 40px 20px; margin-top: 60px;">
        <div class="container">
            <p>${locale === 'fa' ? 'ساخته شده با سیستم مدیریت محتوای چین‌بینو' : 'Powered by Chinbino CMS'}</p>
            <p style="margin-top: 10px; opacity: 0.8;">© 2025 Chinbino - All rights reserved</p>
        </div>
    </footer>
</body>
</html>
    `;
  }

  /**
   * تابع helper برای escape کردن HTML
   */
  private escapeHtml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
