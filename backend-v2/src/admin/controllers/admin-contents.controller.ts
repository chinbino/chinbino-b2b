  // ➕ فرم ایجاد محتوا - نسخه ساده
  @Get('contents/new')
  @Render('simple-content-create')
  createForm(@Query('error') error?: string) { // ✅ اضافه کردن پارامتر error
    return { 
      contentTypes: [
        'article', 'news', 'landing', 'landing_market', 
        'product_showcase', 'faq_page', 'static_page'
      ],
      statusTypes: ['draft', 'published', 'archived'],
      error: error || null // ✅ اضافه کردن error به context
    };
  }
