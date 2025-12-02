import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== بررسی مسیرهای views ==========');
  
  // لیست تمام مسیرهای ممکن
  const possiblePaths = [
    // مسیر dist (پس از build)
    join(__dirname, 'admin/views'),
    // مسیر src (برای توسعه)
    join(__dirname, '../src/admin/views'),
    // مسیر absolute از root
    join(process.cwd(), 'dist/admin/views'),
    join(process.cwd(), 'src/admin/views'),
    // مسیرهای Render
    '/opt/render/project/src/backend-v2/dist/admin/views',
    '/opt/render/project/src/backend-v2/src/admin/views',
  ];
  
  // بررسی هر مسیر
  let selectedPath = '';
  possiblePaths.forEach((path, index) => {
    const exists = existsSync(path);
    console.log(`${index + 1}. ${path} - ${exists ? '✅ موجود' : '❌ عدم وجود'}`);
    
    if (exists && !selectedPath) {
      selectedPath = path;
      console.log(`   📁 انتخاب شد!`);
      
      // لیست فایل‌ها
      try {
        const files = readdirSync(path);
        console.log(`   📄 فایل‌ها: ${files.join(', ')}`);
        
        // اگر layouts وجود دارد، آن را هم چک کن
        const layoutsPath = join(path, 'layouts');
        if (existsSync(layoutsPath)) {
          const layoutFiles = readdirSync(layoutsPath);
          console.log(`   🏗️  layouts: ${layoutFiles.join(', ')}`);
        }
      } catch (error) {
        console.log(`   ⚠️ خطا در خواندن: ${error.message}`);
      }
    }
  });
  
  if (!selectedPath) {
    console.error('❌ هیچ مسیر views یافت نشد!');
    console.log('📁 مسیر جاری:', process.cwd());
    console.log('📁 محتوای مسیر جاری:', readdirSync(process.cwd()));
  } else {
    console.log(`\n🎯 انتخاب مسیر: ${selectedPath}`);
    app.setBaseViewsDir(selectedPath);
    app.setViewEngine('hbs');
  }
  
  console.log('=========================================\n');
  
  // Middleware برای log درخواست‌ها
  app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
  });
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== سرور اجرا شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: https://chinbino-api-v2.onrender.com/admin/sellers`);
  console.log(`📁 مسیر views: ${selectedPath || 'تعیین نشد'}`);
  console.log('=====================================\n');
}

bootstrap();
