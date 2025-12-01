  // ➕ فرم ایجاد محتوا - نسخه ساده
  @Get('contents/new')
  @Render('simple-content-create')
  createForm(@Query('error') error?: string) {
    return { 
      success: true, // ✅ اضافه کردن success
      contentTypes: [
        'article', 'news', 'landing', 'landing_market', 
        'product_showcase', 'faq_page', 'static_page'
      ],
      statusTypes: ['draft', 'published', 'archived'],
      error: error || null
    };
  }
