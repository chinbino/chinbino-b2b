import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیمات نهایی Handlebars ==========');
  
  // بررسی هر دو مسیر ممکن
  const path1 = join(__dirname, 'admin/views');      // مسیر قدیمی
  const path2 = join(__dirname, 'views/admin');      // مسیر جدید (بر اساس logها)
  
  console.log('📁 بررسی مسیر ۱ (admin/views):', path1);
  console.log('📁 بررسی مسیر ۲ (views/admin):', path2);
  
  const path1Exists = existsSync(path1);
  const path2Exists = existsSync(path2);
  
  console.log('📁 مسیر ۱ وجود دارد؟', path1Exists);
  console.log('📁 مسیر ۲ وجود دارد؟', path2Exists);
  
  let viewsPath = '';
  let selectedPathName = '';
  
  if (path2Exists) {
    viewsPath = path2;
    selectedPathName = 'views/admin';
    console.log('✅ انتخاب مسیر: views/admin (بر اساس logهای قبلی)');
  } else if (path1Exists) {
    viewsPath = path1;
    selectedPathName = 'admin/views';
    console.log('⚠️ انتخاب مسیر جایگزین: admin/views');
  } else {
    // اگر هیچکدام نبود، از مسیر پیش‌فرض استفاده کن
    viewsPath = path2;
    selectedPathName = 'views/admin (پیش‌فرض)';
    console.log('⚠️ هیچ مسیر یافت نشد، استفاده از پیش‌فرض');
  }
  
  console.log(`📁 مسیر نهایی views: ${viewsPath}`);
  
  // بررسی محتوای مسیر انتخاب شده
  if (existsSync(viewsPath)) {
    try {
      const files = readdirSync(viewsPath);
      console.log(`📄 ${files.length} فایل در مسیر:`, files.join(', '));
      
      // بررسی layouts
      const layoutsPath = join(viewsPath, 'layouts');
      if (existsSync(layoutsPath)) {
        const layoutFiles = readdirSync(layoutsPath);
        console.log(`📁 ${layoutFiles.length} فایل در layouts:`, layoutFiles.join(', '));
      }
    } catch (error) {
      console.log('⚠️ خطا در خواندن محتوای مسیر:', error.message);
    }
  } else {
    console.error('❌ مسیر انتخابی وجود ندارد!');
    console.log('📁 محتوای dist:', readdirSync(__dirname));
  }
  
  // تنظیم view engine
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ثبت helper استاندارد
  const hbs = require('hbs');
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  console.log('✅ Handlebars با مسیر صحیح تنظیم شد');
  console.log('=============================================\n');
  
  // Middleware برای log درخواست‌ها
  app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
  });
  
  // اجرای سرور
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== Phase C2.1 تکمیل شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🌐 آدرس اصلی: https://chinbino-api-v2.onrender.com`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
  console.log(`🛒 پنل ادمین (عمومی): https://chinbino-api-v2.onrender.com/admin/sellers`);
  console.log(`📁 مسیر views انتخابی: ${selectedPathName}`);
  console.log(`📁 مسیر کامل: ${viewsPath}`);
  console.log('============================================\n');
  
  // نمایش همه routeهای فعال
  console.log('🛣️  Routeهای فعال:');
  console.log('   - GET  /admin/sellers');
  console.log('   - GET  /admin/sellers/create');
  console.log('   - GET  /admin/sellers/:id/edit');
  console.log('============================================\n');
}

bootstrap();
