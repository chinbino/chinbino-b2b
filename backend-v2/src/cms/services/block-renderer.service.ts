import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRendererService {
  
  /**
   * تبدیل آرایه بلوک‌ها به HTML کامل
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
          return this.renderTextBlock(block, locale);
        case 'categories':
          return this.renderCategoriesBlock(block, locale);
        case 'process':
          return this.renderProcessBlock(block, locale);
        case 'suppliers':
          return this.renderSuppliersBlock(block, locale);
        case 'faq':
          return this.renderFaqBlock(block, locale);
        default:
          return this.renderUnknownBlock(block, locale);
      }
    } catch (error) {
      return `<!-- خطا در رندر بلوک ${block.type}: ${error.message} -->`;
    }
  }

  // ... متدهای قبلی (heading, paragraph, hero, image, list, text) بدون تغییر

  /**
   * بلوک دسته‌بندی‌ها
   */
  private renderCategoriesBlock(block: any, locale: string): string {
    const categories = block.data?.categories || block.data?.items || [];
    const title = this.getLocalizedText(block.data?.title, locale) || 'دسته‌بندی‌ها';
    
    if (!Array.isArray(categories) || categories.length === 0) return '';

    const categoryItems = categories
      .map(category => {
        const name = this.getLocalizedText(category.name, locale) || 'دسته‌بندی';
        const description = this.getLocalizedText(category.description, locale) || '';
        const icon = category.icon || '📦';
        
        return `
          <div class="category-item" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; transition: transform 0.2s;">
            <div style="font-size: 2rem; margin-bottom: 10px;">${icon}</div>
            <h3 style="margin-bottom: 10px; color: #2d3748;">${name}</h3>
            ${description ? `<p style="color: #718096; font-size: 14px;">${description}</p>` : ''}
          </div>
        `;
      })
      .join('');

    return `
      <section class="categories-block" style="margin: 40px 0;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #2d3748;">${title}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          ${categoryItems}
        </div>
      </section>
    `;
  }

  /**
   * بلوک فرآیند
   */
  private renderProcessBlock(block: any, locale: string): string {
    const steps = block.data?.steps || block.data?.items || [];
    const title = this.getLocalizedText(block.data?.title, locale) || 'فرآیند کار';
    
    if (!Array.isArray(steps) || steps.length === 0) return '';

    const stepItems = steps
      .map((step, index) => {
        const title = this.getLocalizedText(step.title, locale) || `مرحله ${index + 1}`;
        const description = this.getLocalizedText(step.description, locale) || '';
        
        return `
          <div class="process-step" style="display: flex; align-items: start; margin-bottom: 30px;">
            <div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-left: 15px; flex-shrink: 0;">
              ${index + 1}
            </div>
            <div>
              <h3 style="margin-bottom: 10px; color: #2d3748;">${title}</h3>
              ${description ? `<p style="color: #718096; line-height: 1.6;">${description}</p>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <section class="process-block" style="margin: 40px 0;">
        <h2 style="text-align: center; margin-bottom: 40px; color: #2d3748;">${title}</h2>
        <div style="max-width: 800px; margin: 0 auto;">
          ${stepItems}
        </div>
      </section>
    `;
  }

  /**
   * بلوک تامین‌کنندگان
   */
  private renderSuppliersBlock(block: any, locale: string): string {
    const suppliers = block.data?.suppliers || block.data?.items || [];
    const title = this.getLocalizedText(block.data?.title, locale) || 'تامین‌کنندگان';
    
    if (!Array.isArray(suppliers) || suppliers.length === 0) return '';

    const supplierItems = suppliers
      .map(supplier => {
        const name = this.getLocalizedText(supplier.name, locale) || 'تامین‌کننده';
        const description = this.getLocalizedText(supplier.description, locale) || '';
        const location = this.getLocalizedText(supplier.location, locale) || '';
        const specialty = this.getLocalizedText(supplier.specialty, locale) || '';
        
        return `
          <div class="supplier-item" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px; color: #2d3748;">${name}</h3>
            ${specialty ? `<p style="color: #667eea; font-weight: bold; margin-bottom: 10px;">${specialty}</p>` : ''}
            ${location ? `<p style="color: #718096; margin-bottom: 10px;">📍 ${location}</p>` : ''}
            ${description ? `<p style="color: #4a5568; line-height: 1.6;">${description}</p>` : ''}
          </div>
        `;
      })
      .join('');

    return `
      <section class="suppliers-block" style="margin: 40px 0;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #2d3748;">${title}</h2>
        <div style="max-width: 900px; margin: 0 auto;">
          ${supplierItems}
        </div>
      </section>
    `;
  }

  /**
   * بلوک سوالات متداول
   */
  private renderFaqBlock(block: any, locale: string): string {
    const faqs = block.data?.faqs || block.data?.items || [];
    const title = this.getLocalizedText(block.data?.title, locale) || 'سوالات متداول';
    
    if (!Array.isArray(faqs) || faqs.length === 0) return '';

    const faqItems = faqs
      .map(faq => {
        const question = this.getLocalizedText(faq.question, locale) || '';
        const answer = this.getLocalizedText(faq.answer, locale) || '';
        
        if (!question) return '';
        
        return `
          <div class="faq-item" style="border-bottom: 1px solid #e2e8f0; padding: 20px 0;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">${question}</h3>
            <div style="color: #4a5568; line-height: 1.7; padding-right: 10px;">${answer}</div>
          </div>
        `;
      })
      .join('');

    return `
      <section class="faq-block" style="margin: 40px 0;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #2d3748;">${title}</h2>
        <div style="max-width: 800px; margin: 0 auto;">
          ${faqItems}
        </div>
      </section>
    `;
  }

  /**
   * بلوک ناشناخته یا پشتیبانی نشده
   */
  private renderUnknownBlock(block: any, locale: string): string {
    // نمایش اطلاعات دیباگ برای بلوک‌های ناشناخته
    return `
      <div class="unknown-block" style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 15px 0;">
        <strong>⚠️ بلوک نوع "${block.type}"</strong>
        <div style="font-size: 12px; color: #856404; margin-top: 5px;">
          این نوع بلوک نیاز به پیاده‌سازی دارد.
          <details style="margin-top: 5px;">
            <summary>داده‌های بلوک:</summary>
            <pre style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px; font-size: 10px; overflow: auto;">${JSON.stringify(block, null, 2)}</pre>
          </details>
        </div>
      </div>
    `;
  }

  // ... متد getLocalizedText و validateBlocks و getSupportedBlockTypes بدون تغییر

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
      'text',
      'categories',
      'process', 
      'suppliers',
      'faq'
    ];
  }
}
