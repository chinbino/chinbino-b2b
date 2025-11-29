import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRendererService {
  
  /**
   * تبدیل آرایه بلوک‌ها به HTML کامل
   * @param blocks آرایه بلوک‌ها
   * @param locale زبان مورد نظر (پیش‌فرض: fa)
   * @returns رشته HTML
   */
  renderBlocks(blocks: any[], locale: string = 'fa'): string {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return '<div class="empty-content"><p>هیچ محتوایی برای نمایش وجود ندارد.</p></div>';
    }

    try {
      const htmlBlocks = blocks
        .map((block) => this.renderSingleBlock(block, locale))
        .filter(html => html !== '') // حذف بلوک‌های خالی
        .join('\n');

      return htmlBlocks || '<div class="empty-content"><p>هیچ محتوایی برای نمایش وجود ندارد.</p></div>';
    } catch (error) {
      console.error('Error rendering blocks:', error);
      return '<div class="error-content"><p>خطا در نمایش محتوا</p></div>';
    }
  }

  /**
   * رندر یک بلوک واحد بر اساس نوع آن
   */
  private renderSingleBlock(block: any, locale: string): string {
    // اعتبارسنجی اولیه
    if (!block || typeof block !== 'object' || !block.type) {
      return '<!-- بلوک نامعتبر -->';
    }

    try {
      switch (block.type) {
        case 'heading':
          return this.renderHeadingBlock(block, locale);
        case 'paragraph':
          return this.renderParagraphBlock(block, locale);
        case 'hero':
          return this.renderHeroBlock(block, locale);
        case 'image':
          return this.renderImageBlock(block, locale);
        case 'list':
          return this.renderListBlock(block, locale);
        case 'text':
          return this.renderTextBlock(block, locale); // برای سازگاری با نسخه قبلی
        default:
          return this.renderUnknownBlock(block, locale);
      }
    } catch (error) {
      return `<!-- خطا در رندر بلوک ${block.type}: ${error.message} -->`;
    }
  }

  /**
   * بلوک هدینگ (عنوان)
   */
  private renderHeadingBlock(block: any, locale: string): string {
    const level = block.data?.level || 2;
    const text = this.getLocalizedText(block.data?.text, locale) || 'عنوان';
    const alignment = block.data?.alignment || 'right';
    
    // محدود کردن level بین 1 تا 6
    const safeLevel = Math.max(1, Math.min(6, level));
    
    return `<h${safeLevel} class="content-heading" style="text-align: ${alignment}; margin: 20px 0 15px 0; color: #333; font-weight: bold;">${text}</h${safeLevel}>`;
  }

  /**
   * بلوک پاراگراف
   */
  private renderParagraphBlock(block: any, locale: string): string {
    const text = this.getLocalizedText(block.data?.text, locale) || '';
    const alignment = block.data?.alignment || 'right';
    
    if (!text.trim()) return '';
    
    return `<p class="content-paragraph" style="text-align: ${alignment}; line-height: 1.8; margin-bottom: 15px; color: #555; font-size: 16px;">${text}</p>`;
  }

  /**
   * بلوک هیرو (صفحه اصلی)
   */
  private renderHeroBlock(block: any, locale: string): string {
    const title = this.getLocalizedText(block.data?.title, locale) || '';
    const subtitle = this.getLocalizedText(block.data?.subtitle, locale) || '';
    const background = block.data?.background || '#f8f9fa';
    const textColor = block.data?.textColor || '#333';
    
    return `
      <section class="content-hero" style="background: ${background}; padding: 80px 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
        ${title ? `<h1 style="margin-bottom: 20px; color: ${textColor}; font-size: 2.5rem;">${title}</h1>` : ''}
        ${subtitle ? `<p style="font-size: 1.2rem; color: ${textColor}; opacity: 0.8; max-width: 600px; margin: 0 auto;">${subtitle}</p>` : ''}
      </section>
    `;
  }

  /**
   * بلوک تصویر
   */
  private renderImageBlock(block: any, locale: string): string {
    const url = block.data?.url || '';
    const alt = this.getLocalizedText(block.data?.alt, locale) || 'تصویر';
    const caption = this.getLocalizedText(block.data?.caption, locale) || '';
    const alignment = block.data?.alignment || 'center';
    
    if (!url) return '';
    
    return `
      <figure class="content-image" style="text-align: ${alignment}; margin: 25px 0;">
        <img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        ${caption ? `<figcaption style="margin-top: 10px; font-size: 14px; color: #666; font-style: italic;">${caption}</figcaption>` : ''}
      </figure>
    `;
  }

  /**
   * بلوک لیست
   */
  private renderListBlock(block: any, locale: string): string {
    const items = block.data?.items || [];
    const style = block.data?.style || 'unordered';
    
    if (!Array.isArray(items) || items.length === 0) return '';
    
    const listItems = items
      .map(item => {
        const text = this.getLocalizedText(item?.text, locale) || '';
        return text ? `<li style="margin-bottom: 8px; line-height: 1.6; padding-right: 5px;">${text}</li>` : '';
      })
      .filter(item => item !== '')
      .join('');
    
    if (!listItems) return '';
    
    const tag = style === 'ordered' ? 'ol' : 'ul';
    const listStyle = style === 'ordered' ? 'decimal' : 'disc';
    
    return `
      <div class="content-list" style="margin: 20px 0;">
        <${tag} style="padding-right: 25px; list-style-type: ${listStyle};">
          ${listItems}
        </${tag}>
      </div>
    `;
  }

  /**
   * بلوک متن (برای سازگاری با نسخه قبلی)
   */
  private renderTextBlock(block: any, locale: string): string {
    const text = this.getLocalizedText(block.content?.text, locale) || 
                 this.getLocalizedText(block.content?.blocks?.[0]?.text, locale) || 
                 'متن';
    
    return `<div class="content-text" style="line-height: 1.7; margin-bottom: 15px; color: #555;">${text}</div>`;
  }

  /**
   * بلوک ناشناخته یا پشتیبانی نشده
   */
  private renderUnknownBlock(block: any, locale: string): string {
    return `<!-- بلوک نوع "${block.type}" پشتیبانی نمی‌شود -->`;
  }

  /**
   * گرفتن متن متناسب با زبان
   */
  private getLocalizedText(textObj: any, locale: string): string {
    if (!textObj || typeof textObj !== 'object') {
      return '';
    }
    
    // اول زبان درخواستی، سپس فارسی، سپس اولین مقدار موجود
    return textObj[locale] || textObj.fa || textObj.en || Object.values(textObj)[0] || '';
  }

  /**
   * اعتبارسنجی ساختار بلوک‌ها
   */
  validateBlocks(blocks: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(blocks)) {
      return { isValid: false, errors: ['بلوک‌ها باید یک آرایه باشند'] };
    }

    blocks.forEach((block, index) => {
      if (!block || typeof block !== 'object') {
        errors.push(`بلوک ${index}: ساختار نامعتبر`);
        return;
      }

      if (!block.type || typeof block.type !== 'string') {
        errors.push(`بلوک ${index}: فیلد type الزامی است`);
      }

      if (!block.data && !block.content) {
        errors.push(`بلوک ${index}: فیلد data یا content الزامی است`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * دریافت لیست نوع‌های بلوک پشتیبانی شده
   */
  getSupportedBlockTypes(): string[] {
    return [
      'heading',
      'paragraph',
      'hero', 
      'image',
      'list',
      'text' // برای سازگاری با نسخه قبلی
    ];
  }
}
