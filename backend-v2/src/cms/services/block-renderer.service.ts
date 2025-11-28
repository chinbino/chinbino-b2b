import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRendererService {
  async renderBlocks(blocks: any[]): Promise<string> {
    // نسخه ساده - فقط برای تست
    let html = '';

    for (const block of blocks) {
      html += await this.renderBlock(block);
    }

    return html || '<div>No content</div>';
  }

  private async renderBlock(block: any): Promise<string> {
    // رندر ساده برای تست - بعداً کامل می‌شود
    switch (block.type) {
      case 'heading':
        return `<h2>${block.content?.text?.fa || 'No title'}</h2>`;
      
      case 'text':
        return `<div class="text-block">${block.content?.blocks?.[0]?.text || 'No text'}</div>`;
      
      case 'hero':
        return `<section class="hero">
          <h1>${block.content?.heading?.fa || 'Hero Title'}</h1>
          <p>${block.content?.subheading?.fa || 'Hero Subtitle'}</p>
        </section>`;
      
      default:
        return `<div class="block-${block.type}">Block type: ${block.type}</div>`;
    }
  }
}
