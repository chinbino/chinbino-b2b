// @ts-nocheck
import { Controller, Get, Query, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from '../services/content.service';
import { BlockRendererService } from '../services/block-renderer.service';

@Controller()
export class PublicPagesController {
  constructor(
    private readonly contentService: ContentService,
    private readonly blockRenderer: BlockRendererService,
  ) {}

  @Get('yiwu-market')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async yiwuMarket(
    @Query('locale') locale: string = 'fa',
    @Res() res: Response,
  ): Promise<void> {
    try {
      const content = await this.contentService.findBySlug('yiwu-market');
      
      if (!content) {
        res.status(404).send(this.generateNotFound(locale));
        return;
      }

      const bodyHtml = this.blockRenderer.renderBlocks(content.blocks, locale);
      const seo = content.seo || {};
      
      const html = `
<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHtml(content.title?.fa || 'Yiwu Market')}</title>
</head>
<body>
    <h1>${this.escapeHtml(content.title?.fa || 'Yiwu Market')}</h1>
    ${bodyHtml}
</body>
</html>`;
      
      res.send(html);

    } catch (error) {
      res.status(500).send(this.generateError(error.message, locale));
    }
  }

  private generateNotFound(locale: string): string {
    return `<!DOCTYPE html><html><body><h1>404 - Page Not Found</h1></body></html>`;
  }

  private generateError(error: string, locale: string): string {
    return `<!DOCTYPE html><html><body><h1>500 - Error</h1><p>${this.escapeHtml(error)}</p></body></html>`;
  }

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
