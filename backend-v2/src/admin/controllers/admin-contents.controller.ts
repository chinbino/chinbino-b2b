  // ✅ ایجاد محتوا
  @Post('contents')
  async createContent(@Body() body: any, @Res() res: Response) {
    console.log('📥 دریافت داده‌های فرم:', body); // ✅ اضافه شود
    
    try {
      const createDto: CreateContentDto = {
        type: body.type,
        title: { fa: body.title_fa, en: body.title_en || '' },
        slug: body.slug,
        status: body.status,
        excerpt: { fa: body.excerpt_fa, en: body.excerpt_en || '' },
        categories: body.categories ? body.categories.split(',').map((c: string) => c.trim()) : [],
        tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
        locales: body.locales || ['fa'],
        seo: {
          metaTitle: { fa: body.meta_title_fa, en: body.meta_title_en || '' },
          metaDescription: { fa: body.meta_description_fa, en: body.meta_description_en || '' },
          robots: body.robots || 'index,follow'
        },
        blocks: body.blocks ? JSON.parse(body.blocks) : []
      };

      console.log('📤 ارسال به سرویس:', createDto); // ✅ اضافه شود
      
      const result = await this.contentService.create(createDto, 'admin-user-id');
      console.log('✅ نتیجه سرویس:', result); // ✅ اضافه شود
      
      res.redirect('/admin/contents');
    } catch (error) {
      console.error('❌ خطا در ایجاد محتوا:', error); // ✅ اضافه شود
      res.redirect('/admin/contents/new?error=' + encodeURIComponent(error.message));
    }
  }
