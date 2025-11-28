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

  // ✅ متد findAll اضافه شد
  async findAll(query: any = {}): Promise<Content[]> {
    return await this.contentRepository.find({
      where: query,
      relations: ['author', 'mainImage'],
      order: { createdAt: 'DESC' }
    });
  }

  // ✅ متد findOne اضافه شد
  async findOne(id: number): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id: id } as any,
      relations: ['author', 'mainImage']
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async create(createContentDto: CreateContentDto, authorId: string): Promise<Content> {
    // بررسی تکراری نبودن slug
    const existingContent = await this.contentRepository.findOne({
      where: { slug: createContentDto.slug }
    });

    if (existingContent) {
      throw new ConflictException('Slug already exists');
    }

    // ایجاد محتوای جدید - بدون استفاده از create()
    const content = new Content();
    content.type = createContentDto.type;
    content.title = createContentDto.title;
    content.slug = createContentDto.slug;
    content.status = createContentDto.status || ContentStatus.DRAFT;
    content.author = { id: authorId } as any;
    content.publishedAt = createContentDto.status === ContentStatus.PUBLISHED ? new Date() : null;
    content.excerpt = createContentDto.excerpt;
    content.categories = createContentDto.categories;
    content.tags = createContentDto.tags;
    content.locales = createContentDto.locales;
    content.seo = createContentDto.seo as any;
    content.blocks = createContentDto.blocks;
    
    // رندر HTML اولیه
    if (content.blocks && content.blocks.length > 0) {
      content.renderedHtml = '<div>Rendered content will be here</div>';
    }

    const savedContent = await this.contentRepository.save(content);

    // ایجاد revision اولیه
    await this.createRevision(savedContent, authorId);

    return savedContent;
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

    // رندر HTML جدید
    if (content.blocks && content.blocks.length > 0) {
      content.renderedHtml = '<div>Updated rendered content</div>';
    }

    if (updateData.status === ContentStatus.PUBLISHED && !content.publishedAt) {
      content.publishedAt = new Date();
    }

    return await this.contentRepository.save(content);
  }

  private async createRevision(content: Content, authorId: string): Promise<void> {
    const revision = new ContentRevision();
    revision.content = { id: (content as any).id } as any;
    revision.blocks = content.blocks;
    revision.seo = content.seo;
    revision.meta = {
      note: 'Auto-saved revision',
      status: content.status,
    };
    revision.author = { id: authorId } as any;

    await this.contentRevisionRepository.save(revision);
  }
}
