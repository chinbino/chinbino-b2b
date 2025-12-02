import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. ساخت برنامه NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 2. به برنامه بگو viewهای ادمین کجا هستند
  const adminViewsPath = join(__dirname, 'admin/views');
  console.log('📁 مسیر views های ادمین:', adminViewsPath);
  
  app.setBaseViewsDir(adminViewsPath);
  
  // 3. به برنامه بگو از Handlebars استفاده کن
  app.setViewEngine('hbs');
  
  // 4. اجرای برنامه
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('✅ برنامه NestJS اجرا شد!');
  console.log(`🌐 آدرس: http://localhost:${port}`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
}

// اجرای برنامه
bootstrap();
