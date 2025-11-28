import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentStatus } from '../entities/content.entity';
import { ContentRevision } from '../entities/content-revision.entity';
import { CreateContentDto } from '../dto/create-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(ContentRevision)
    private readonly contentRevisionRepository: Repository<ContentRevision>,
  ) {}

  async create(createContentDto: CreateContentDto, authorId: string): Promise<Content> {
    // بررسی تکراری نبودن slug
    const existingContent = await this.contentRepository.findOne({
      where: { slug: createContentDto.slug }
    });

    if (existingContent) {
      throw new ConflictException('Slug already exists');
    }

    // ایجاد محتوای جدید
    const contentData = {
      ...createContentDto,
      author: { id: authorId },
      publishedAt: createContentDto.status === ContentStatus.PUBLISHED ? new Date() : null,
    };

    const content = this.contentRepository.create(contentData as any);

    // رندر HTML اولیه (موقتاً غیرفعال)
    if (content.blocks && content.blocks.length > 0) {
      content.renderedHtml = '<div>Rendered content will be here</div>';
    }

    const savedContent = await this.contentRepository.save(content);

    // ایجاد revision اولیه
    await this.createRevision(savedContent as any, authorId);

    return savedContent as any;
  }

  async findBySlug(slug: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { slug },
      relations: ['author', 'mainImage'],
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async update(id: number, updateData: Partial<Content>, authorId: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id: id } as any
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // ایجاد revision از وضعیت فعلی
    await this.createRevision(content, authorId);

    // آپدیت محتوا
    Object.assign(content, updateData);

    // رندر HTML جدید (موقتاً غیرفعال)
    if (content.blocks && content.blocks.length > 0) {
      content.renderedHtml = '<div>Updated rendered content</div>';
    }

    if (updateData.status === ContentStatus.PUBLISHED && !content.publishedAt) {
      content.publishedAt = new Date();
    }

    return await this.contentRepository.save(content);
  }

  private async createRevision(content: any, authorId: string): Promise<void> {
    const revisionData = {
      content: { id: content.id } as any,
      blocks: content.blocks,
      seo: content.seo,
      meta: {
        note: 'Auto-saved revision',
        status: content.status,
      },
      author: { id: authorId } as any,
    };

    const revision = this.contentRevisionRepository.create(revisionData as any);
    await this.contentRevisionRepository.save(revision);
  }
}
