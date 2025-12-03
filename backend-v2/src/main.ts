import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیمات نهایی Handlebars ==========');
  
  // مسیر استاندارد و ثابت
  const viewsPath = join(__dirname, 'admin/views');
  
  console.log('📁 مسیر views استاندارد:', viewsPath);
  console.log('📁 وجود دارد؟', existsSync(viewsPath));
  
  if (existsSync(viewsPath)) {
    const files = readdirSync(viewsPath);
    console.log(`📄 ${files.length} فایل موجود:`, files.join(', '));
    
    // بررسی layouts
    const layoutsPath = join(viewsPath, 'layouts');
    if (existsSync(layoutsPath)) {
      const layoutFiles = readdirSync(layoutsPath);
      console.log(`📁 ${layoutFiles.length} فایل در layouts:`, layoutFiles.join(', '));
    }
  } else {
    console.error('❌ مسیر views استاندارد یافت نشد!');
    console.log('📁 مسیر جاری (__dirname):', __dirname);
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
  
  console.log('✅ Handlebars با ساختار استاندارد تنظیم شد');
  console.log('=============================================\n');
  
  // اجرای سرور
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== Phase C2.1 تکمیل شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
  console.log(`📁 ساختار views استاندارد: ${viewsPath}`);
  console.log('============================================\n');
}

bootstrap();
