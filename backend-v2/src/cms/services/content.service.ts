  async create(createContentDto: CreateContentDto, authorId: string): Promise<Content> {
    // بررسی تکراری نبودن slug
    const existingContent = await this.contentRepository.findOne({
      where: { slug: createContentDto.slug }
    });

    if (existingContent) {
      throw new ConflictException('Slug already exists');
    }

    // ایجاد محتوای جدید
    const content = new Content();
    content.type = createContentDto.type;
    content.title = createContentDto.title;
    content.slug = createContentDto.slug;
    content.status = createContentDto.status || ContentStatus.DRAFT;
    
    // ✅ FIX: اگر authorId معتبر UUID نیست، آن را null بگذار
    if (this.isValidUUID(authorId)) {
      content.author = { id: authorId } as any;
    } else {
      content.author = null; // یا کامنت کنید: // content.author = null;
    }
    
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

  // ✅ Helper function برای بررسی UUID
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
