import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیمات محیط تولید ==========');
  
  // مسیرهای ممکن برای viewها
  const possiblePaths = [
    join(__dirname, 'views/admin'),      // مسیر تولید جدید
    join(__dirname, 'admin/views'),      // مسیر قدیمی
    join(__dirname, '../views/admin'),   // یک سطح بالاتر
    join(__dirname, '../admin/views'),   // یک سطح بالاتر
  ];
  
  console.log('📁 بررسی مسیرهای viewها:');
  
  let viewsPath = '';
  let selectedPath = '';
  
  possiblePaths.forEach((path, index) => {
    const exists = existsSync(path);
    console.log(`  ${index + 1}. ${path} - ${exists ? '✅ موجود' : '❌ عدم وجود'}`);
    
    if (exists && !viewsPath) {
      viewsPath = path;
      selectedPath = `مسیر ${index + 1}: ${path}`;
    }
  });
  
  // اگر هیچ مسیری پیدا نشد
  if (!viewsPath) {
    viewsPath = possiblePaths[0];
    selectedPath = `پیش‌فرض: ${viewsPath}`;
    console.log('⚠️ هیچ مسیر view یافت نشد، استفاده از پیش‌فرض');
  }
  
  console.log(`\n🎯 انتخاب شده: ${selectedPath}`);
  console.log('📁 وجود دارد؟', existsSync(viewsPath));
  
  // نمایش محتوای مسیر انتخاب شده
  if (existsSync(viewsPath)) {
    try {
      const files = readdirSync(viewsPath);
      console.log(`📄 ${files.length} فایل موجود:`, files.join(', '));
      
      // بررسی layouts
      const layoutsPath = join(viewsPath, 'layouts');
      if (existsSync(layoutsPath)) {
        const layoutFiles = readdirSync(layoutsPath);
        console.log(`📁 ${layoutFiles.length} فایل در layouts:`, layoutFiles.join(', '));
      }
    } catch (error) {
      console.log('⚠️ خطا در خواندن محتوا:', error.message);
    }
  } else {
    console.log('❌ مسیر انتخابی وجود ندارد!');
    console.log('📁 محتوای dist:', readdirSync(__dirname));
  }
  
  // تنظیم view engine
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ثبت helperهای Handlebars
  const hbs = require('hbs');
  
  // Helper برای مقایسه
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  // Helper برای if
  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      default: return options.inverse(this);
    }
  });
  
  console.log('✅ Handlebars برای تولید تنظیم شد');
  console.log('=============================================\n');
  
  // اجرای سرور
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== سرور تولید اجرا شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🌐 آدرس اصلی: https://chinbino-api-v2.onrender.com`);
  console.log(`🛒 پنل ادمین: https://chinbino-api-v2.onrender.com/admin/sellers`);
  console.log(`📁 مسیر views: ${viewsPath}`);
  console.log('============================================\n');
  
  // نمایش اطلاعات
  console.log('📊 اطلاعات پروژه:');
  console.log('   - نام: ChinBino B2B Backend V2');
  console.log('   - فاز: C2.1 (Viewهای ادمین)');
  console.log('   - محیط: تولید (Production)');
  console.log('   - موتور view: Handlebars (hbs)');
  console.log('============================================\n');
}

bootstrap();
