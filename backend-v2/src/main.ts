import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔧 ========== راه‌اندازی Phase C2.1 ==========');
  
  // مسیر views در dist
  const viewsPath = join(__dirname, 'views/admin');
  
  console.log('📁 مسیر views:', viewsPath);
  console.log('📁 وجود دارد؟', existsSync(viewsPath));
  
  if (existsSync(viewsPath)) {
    const files = readdirSync(viewsPath);
    console.log(`📄 ${files.length} فایل موجود:`, files.join(', '));
  } else {
    console.log('⚠️ مسیر views در dist وجود ندارد (ممکن است در حال build باشد)');
  }
  
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ✅ فقط این helper - inline function
  const hbs = require('hbs');
  hbs.registerHelper('eq', (a, b) => a === b);
  
  console.log('✅ Handlebars با helper eq تنظیم شد');
  console.log('========================================\n');
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n🎉 ========== Phase C2.1 کامل شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: https://chinbino-api-v2.onrender.com/admin/sellers`);
  console.log(`📁 مسیر views: ${viewsPath}`);
  console.log('========================================\n');
}

bootstrap();
