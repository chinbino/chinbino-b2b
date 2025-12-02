import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // مسیر viewها در dist
  const viewsPath = join(__dirname, 'admin/views');
  
  console.log('🔍 ========== بررسی مسیر views ==========');
  console.log('📁 مسیر کامل:', viewsPath);
  console.log('📁 آیا مسیر وجود دارد؟', existsSync(viewsPath));
  
  // اگر مسیر وجود ندارد، مسیرهای ممکن را چک کن
  if (!existsSync(viewsPath)) {
    console.log('⚠️ مسیر اصلی یافت نشد، جستجوی مسیرهای جایگزین...');
    
    const possiblePaths = [
      join(__dirname, 'admin/views'),
      join(__dirname, '../admin/views'),
      join(process.cwd(), 'dist/admin/views'),
      join(process.cwd(), 'src/admin/views'),
      '/opt/render/project/src/backend-v2/dist/admin/views',
      '/opt/render/project/src/backend-v2/src/admin/views',
    ];
    
    possiblePaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path} - ${existsSync(path) ? '✅ موجود' : '❌ عدم وجود'}`);
      if (existsSync(path)) {
        const files = readdirSync(path);
        console.log(`   فایل‌ها: ${files.join(', ')}`);
      }
    });
  } else {
    // اگر مسیر وجود دارد، فایل‌ها را لیست کن
    const files = readdirSync(viewsPath);
    console.log(`📄 فایل‌های موجود در views: ${files.join(', ')}`);
  }
  
  console.log('=========================================\n');
  
  // تنظیم مسیر viewها
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // Middleware برای log درخواست‌ها
  app.use((req, res, next) => {
    console.log(`🌐 درخواست ${req.method}: ${req.url}`);
    next();
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('\n✅ ========== سرور اجرا شد ==========');
  console.log(`🌐 آدرس: http://localhost:${port}`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
  console.log(`➕ ایجاد فروشنده: http://localhost:${port}/admin/sellers/create`);
  console.log(`✏️ ویرایش (نمونه): http://localhost:${port}/admin/sellers/1/edit`);
  console.log('=====================================\n');
}

bootstrap();
