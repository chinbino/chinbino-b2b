import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🏗️  ========== راه‌اندازی با ساختار واقعی پروژه ==========');
  
  // مسیر REAL در dist (بعد از build)
  const REAL_VIEWS_PATH = join(__dirname, 'views/admin');
  
  console.log('📁 __dirname (محل dist/main.js):', __dirname);
  console.log('📁 مسیر REAL views:', REAL_VIEWS_PATH);
  console.log('📁 وجود دارد؟', existsSync(REAL_VIEWS_PATH));
  
  // دیباگ: بررسی ساختار dist
  if (existsSync(REAL_VIEWS_PATH)) {
    const files = readdirSync(REAL_VIEWS_PATH);
    console.log(`✅ ${files.length} فایل موجود:`, files.join(', '));
    
    // بررسی layouts
    const layoutsPath = join(REAL_VIEWS_PATH, 'layouts');
    if (existsSync(layoutsPath)) {
      console.log('📁 layouts:', readdirSync(layoutsPath));
    }
  } else {
    console.log('⚠️ مسیر views در dist وجود ندارد');
    console.log('📁 محتوای __dirname:', readdirSync(__dirname));
    
    // بررسی مسیرهای ممکن
    const checkPaths = [
      join(__dirname, 'views/admin'),
      join(__dirname, 'admin/views'),
      join(process.cwd(), 'dist/views/admin'),
      join(process.cwd(), 'src/admin/views')
    ];
    
    console.log('🔍 بررسی مسیرهای ممکن:');
    checkPaths.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p} - ${existsSync(p) ? '✅' : '❌'}`);
    });
  }
  
  // تنظیم مسیر - حتماً REAL_VIEWS_PATH
  app.setBaseViewsDir(REAL_VIEWS_PATH);
  app.setViewEngine('hbs');
  
  // ثبت helper
  const hbs = require('hbs');
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  console.log('✅ Handlebars تنظیم شد');
  console.log('===============================================\n');
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n🎊 ========== Phase C2.1 - ساختار واقعی ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: https://chinbino-api-v2.onrender.com/admin/sellers`);
  console.log(`📁 مسیر views: ${REAL_VIEWS_PATH}`);
  console.log('===============================================\n');
}

bootstrap();
