  // ✅ تست فرم ساده
  @Get('test-create')
  @Render('test-create')
  testCreateForm() {
    return { message: 'تست فرم ایجاد' };
  }
