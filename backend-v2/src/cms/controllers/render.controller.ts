import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { BlockRendererService } from '../services/block-renderer.service';

@Controller('api/render')
export class RenderController {
  constructor(
    private readonly contentService: ContentService,
    private readonly blockRenderer: BlockRendererService,
  ) {}

  @Get(':slug')
  async renderBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'fa',
  ): Promise<string> {
    const content = await this.contentService.findBySlug(slug);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const bodyHtml = this.blockRenderer.renderBlocks(content.blocks, locale);
    const seo = content.seo || {};

    const metaTitle = seo.metaTitle?.[locale] || seo.metaTitle?.fa || content.title?.[locale] || content.title?.fa || '';
    const metaDescription = seo.metaDescription?.[locale] || seo.metaDescription?.fa || content.excerpt?.[locale] || content.excerpt?.fa || '';

    return `
<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="utf-8" />
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}" />
    <meta name="robots" content="${seo.robots || 'index,follow'}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        ${locale === 'fa' ? 'body { font-family: "Vazirmatn", system-ui, sans-serif; }' : ''}
    </style>
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
</head>
<body>
    ${bodyHtml}
    
    <footer style="background: #333; color: white; text-align: center; padding: 40px 20px; margin-top: 60px;">
        <div class="container">
            <p>ساخته شده با سیستم مدیریت محتوای چین‌بینو</p>
            <p style="margin-top: 10px; opacity: 0.8;">© 2025 Chinbino - All rights reserved</p>
        </div>
    </footer>
</body>
</html>
    `;
  }
}
