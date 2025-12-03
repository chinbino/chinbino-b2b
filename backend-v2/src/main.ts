import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیم Handlebars ==========');
  
  // فقط این مسیر را استفاده کن
  const viewsPath = join(__dirname, 'admin/views');
  
  console.log('📁 مسیر views:', viewsPath);
  console.log('📁 وجود دارد؟', existsSync(viewsPath));
  
  if (existsSync(viewsPath)) {
    const files = readdirSync(viewsPath);
    console.log(`📄 ${files.length} فایل موجود:`, files.join(', '));
  } else {
    console.log('⚠️ مسیر views وجود ندارد (ممکن است در حال ساخت باشد)');
  }
  
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ثبت helper ساده
  const hbs = require('hbs');
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  console.log('✅ Handlebars تنظیم شد');
  console.log('=========================================\n');
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== سرور اجرا شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
  console.log(`📁 مسیر views: ${viewsPath}`);
  console.log('=====================================\n');
}

bootstrap();
