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

  /**
   * صفحه public عمومی برای هر slug (اختیاری - برای توسعه آینده)
   */
  @Get('page/:slug')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async dynamicPage(
    @Query('locale') locale: string = 'fa',
    @Res() res: Response,
  ): Promise<void> {
    try {
      // این endpoint می‌تواند برای صفحات داینامیک دیگر استفاده شود
      const notFoundHtml = this.generateNotFoundPage('dynamic-page', locale);
      res.status(404).send(notFoundHtml);
    } catch (error) {
      const errorHtml = this.generateErrorPage(error.message, locale);
      res.status(500).send(errorHtml);
    }
  }

  /**
   * تولید HTML کامل برای صفحه
   */
  private generateFullPage(options: {
    metaTitle: string;
    metaDescription: string;
    robots: string;
    bodyHtml: string;
    locale: string;
    content: any;
  }): string {
    const { metaTitle, metaDescription, robots, bodyHtml, locale, content } = options;

    return `<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(metaTitle)}</title>
    <meta name="description" content="${this.escapeHtml(metaDescription)}">
    <meta name="robots" content="${robots}">
    
    <!-- استایل‌های پیشرفته -->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${locale === 'fa' ? 'Vazirmatn, Tahoma' : 'system-ui, -apple-system, sans-serif'};
            line-height: 1.7;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            direction: ${locale === 'fa' ? 'rtl' : 'ltr'};
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4a5568;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
        }
        
        .nav-links a {
            color: #4a5568;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #667eea;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .content-wrapper {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 50px;
            margin: 30px auto;
            min-height: 600px;
        }
        
        .page-title {
            text-align: center;
            margin-bottom: 40px;
            color: #2d3748;
            font-size: 2.5rem;
        }
        
        /* استایل‌های برای بلوک‌های رندر شده */
        .content-heading {
            margin: 30px 0 20px 0 !important;
            color: #2d3748 !important;
        }
        
        .content-paragraph {
            margin-bottom: 25px !important;
            color: #4a5568 !important;
            font-size: 16px !important;
        }
        
        .content-hero {
            margin: 40px 0 !important;
            border-radius: 12px !important;
            overflow: hidden !important;
        }
        
        .content-image {
            margin: 30px 0 !important;
            border-radius: 8px !important;
        }
        
        .content-list {
            margin: 25px 0 !important;
        }
        
        .footer {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 40px 0;
            margin-top: 60px;
            text-align: center;
            color: #4a5568;
        }
        
        .debug-info {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
            margin-top: 30px;
            font-size: 14px;
            color: #718096;
        }
    </style>
    
    <!-- فونت Vazirmatn برای فارسی -->
    ${locale === 'fa' ? '<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />' : ''}
</head>
<body>
    <!-- هدر -->
    <header class="header">
        <nav class="nav-container">
            <a href="/" class="logo">${locale === 'fa' ? 'چین‌بینو' : 'Chinbino'}</a>
            <ul class="nav-links">
                <li><a href="/yiwu-market?locale=${locale}">${locale === 'fa' ? 'بازار ییوو' : 'Yiwu Market'}</a></li>
                <li><a href="/admin/contents">${locale === 'fa' ? 'مدیریت' : 'Admin'}</a></li>
                <li>
                    <a href="/yiwu-market?locale=${locale === 'fa' ? 'en' : 'fa'}">
                        ${locale === 'fa' ? 'English' : 'فارسی'}
                    </a>
                </li>
            </ul>
        </nav>
    </header>

    <!-- محتوای اصلی -->
    <main class="container">
        <div class="content-wrapper">
            <h1 class="page-title">${this.escapeHtml(this.getLocalizedValue(options.content.title, locale))}</h1>
            ${bodyHtml}
            
            <!-- اطلاعات دیباگ -->
            <div class="debug-info">
                <strong>${locale === 'fa' ? 'اطلاعات فنی:' : 'Technical Info:'}</strong><br>
                ${locale === 'fa' ? 'صفحه ایجاد شده با CMS چین‌بینو' : 'Page generated by Chinbino CMS'} | 
                ${locale === 'fa' ? 'زبان:' : 'Locale:'} ${locale} | 
                ${locale === 'fa' ? 'آخرین بروزرسانی:' : 'Last updated:'} ${new Date().toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}
            </div>
        </div>
    </main>

    <!-- فوتر -->
    <footer class="footer">
        <div class="container">
            <p>${locale === 'fa' ? 'ساخته شده با سیستم مدیریت محتوای چین‌بینو' : 'Powered by Chinbino CMS'}</p>
            <p style="margin-top: 10px; opacity: 0.8;">© 2025 Chinbino - All rights reserved</p>
        </div>
    </footer>
</body>
</html>`;
  }

  /**
   * صفحه 404
   */
  private generateNotFoundPage(slug: string, locale: string): string {
    return `<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${locale === 'fa' ? 'صفحه پیدا نشد' : 'Page Not Found'}</title>
    <style>
        body { 
            font-family: ${locale === 'fa' ? 'Vazirmatn, Tahoma' : 'system-ui, -apple-system, sans-serif'};
            text-align: center; 
            padding: 100px 20px; 
            background: #f8f9fa;
            direction: ${locale === 'fa' ? 'rtl' : 'ltr'};
        }
        h1 { color: #dc3545; margin-bottom: 20px; }
        a { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <h1>404 - ${locale === 'fa' ? 'صفحه پیدا نشد' : 'Page Not Found'}</h1>
    <p>${locale === 'fa' ? 'صفحه' : 'Page'} "${slug}" ${locale === 'fa' ? 'پیدا نشد' : 'not found'}</p>
    <p><a href="/yiwu-market">${locale === 'fa' ? 'بازگشت به بازار ییوو' : 'Back to Yiwu Market'}</a></p>
</body>
</html>`;
  }

  /**
   * صفحه خطا
   */
  private generateErrorPage(error: string, locale: string): string {
    return `<!DOCTYPE html>
<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${locale === 'fa' ? 'خطای سرور' : 'Server Error'}</title>
    <style>
        body { 
            font-family: ${locale === 'fa' ? 'Vazirmatn, Tahoma' : 'system-ui, -apple-system, sans-serif'};
            text-align: center; 
            padding: 100px 20px; 
            background: #f8f9fa;
            direction: ${locale === 'fa' ? 'rtl' : 'ltr'};
        }
        h1 { color: #dc3545; margin-bottom: 20px; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px auto; max-width: 600px; }
    </style>
</head>
<body>
    <h1>500 - ${locale === 'fa' ? 'خطای سرور' : 'Server Error'}</h1>
    <div class="error">${this.escapeHtml(error)}</div>
    <p><a href="/yiwu-market">${locale === 'fa' ? 'بازگشت به بازار ییوو' : 'Back to Yiwu Market'}</a></p>
</body>
</html>`;
  }

  /**
   * تابع helper برای گرفتن مقدار localized
   */
  private getLocalizedValue(obj: any, locale: string): string {
    if (!obj || typeof obj !== 'object') return '';
    return obj[locale] || obj.fa || obj.en || '';
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
