import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRendererService {
  
  renderBlocks(blocks: any[], locale: string = 'fa'): string {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return '<div class="empty-content"><p>هیچ محتوایی برای نمایش وجود ندارد.</p></div>';
    }

    try {
      const htmlBlocks = blocks
        .map((block) => this.renderSingleBlock(block, locale))
        .filter(html => html !== '')
        .join('\n');

      return htmlBlocks || '<div class="empty-content"><p>هیچ محتوایی برای نمایش وجود ندارد.</p></div>';
    } catch (error) {
      console.error('Error rendering blocks:', error);
      return '<div class="error-content"><p>خطا در نمایش محتوا</p></div>';
    }
  }

  private renderSingleBlock(block: any, locale: string): string {
    if (!block || typeof block !== 'object' || !block.type) {
      return '<!-- بلوک نامعتبر -->';
    }

    try {
      switch (block.type) {
        case 'heading':
          return this.renderHeading(block, locale);
        case 'paragraph':
          return this.renderParagraph(block, locale);
        case 'hero':
          return this.renderHero(block, locale);
        case 'image':
          return this.renderImage(block, locale);
        case 'list':
          return this.renderList(block, locale);
        case 'text':
          return this.renderText(block, locale);
        case 'categories':
          return this.renderCategories(block, locale);
        case 'process':
          return this.renderProcess(block, locale);
        case 'suppliers':
          return this.renderSuppliers(block, locale);
        case 'faq':
          return this.renderFaq(block, locale);
        default:
          return this.renderUnknown(block, locale);
      }
    } catch (error) {
      return `<!-- خطا در رندر بلوک ${block.type}: ${error.message} -->`;
    }
  }

  private renderHeading(block: any, locale: string): string {
    const level = block.data?.level || 2;
    const text = this.getLocalizedText(block.data?.text, locale) || 'عنوان';
    const safeLevel = Math.max(1, Math.min(6, level));
    return `<h${safeLevel}>${text}</h${safeLevel}>`;
  }

  private renderParagraph(block: any, locale: string): string {
    const text = this.getLocalizedText(block.data?.text, locale) || '';
    return text ? `<p>${text}</p>` : '';
  }

  private renderHero(block: any, locale: string): string {
    const title = this.getLocalizedText(block.data?.title, locale) || '';
    const subtitle = this.getLocalizedText(block.data?.subtitle, locale) || '';
    return `
      <section class="hero">
        ${title ? `<h1>${title}</h1>` : ''}
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </section>
    `;
  }

  private renderImage(block: any, locale: string): string {
    const url = block.data?.url || '';
    const alt = this.getLocalizedText(block.data?.alt, locale) || 'تصویر';
    return url ? `<img src="${url}" alt="${alt}" style="max-width:100%">` : '';
  }

  private renderList(block: any, locale: string): string {
    const items = block.data?.items || [];
    if (!Array.isArray(items) || items.length === 0) return '';
    
    const listItems = items
      .map(item => {
        const text = this.getLocalizedText(item?.text, locale) || '';
        return text ? `<li>${text}</li>` : '';
      })
      .filter(item => item !== '')
      .join('');
    
    return `<ul>${listItems}</ul>`;
  }

  private renderText(block: any, locale: string): string {
    const text = this.getLocalizedText(block.content?.text, locale) || '';
    return `<div>${text}</div>`;
  }

  private renderCategories(block: any, locale: string): string {
    const categories = block.data?.categories || [];
    return `<div class="categories">دسته‌بندی‌ها (${categories.length} مورد)</div>`;
  }

  private renderProcess(block: any, locale: string): string {
    const steps = block.data?.steps || [];
    return `<div class="process">فرآیند (${steps.length} مرحله)</div>`;
  }

  private renderSuppliers(block: any, locale: string): string {
    const suppliers = block.data?.suppliers || [];
    return `<div class="suppliers">تامین‌کنندگان (${suppliers.length} مورد)</div>`;
  }

  private renderFaq(block: any, locale: string): string {
    const faqs = block.data?.faqs || [];
    return `<div class="faq">سوالات متداول (${faqs.length} مورد)</div>`;
  }

  private renderUnknown(block: any, locale: string): string {
    return `<div class="unknown-block">بلوک نوع "${block.type}"</div>`;
  }

  private getLocalizedText(textObj: any, locale: string): string {
    if (!textObj || typeof textObj !== 'object') return '';
    return textObj[locale] || textObj.fa || textObj.en || '';
  }
}
