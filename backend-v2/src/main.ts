import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 🔴 فعال کردن Validation Pipe (اضافه شد)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // حذف خودکار فیلدهای اضافی
    forbidNonWhitelisted: false, // برای شروع false باشد
    transform: true, // تبدیل انواع داده (مثلاً string به number)
    disableErrorMessages: false, // نمایش پیام‌های خطا
    validationError: {
      target: false, // عدم نمایش object کامل در خطا
      value: false, // عدم نمایش مقادیر در خطا
    }
  }));
  
  // ✅ تنظیم Handlebars
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // ✅ ثبت Helperهای Handlebars
  hbs.registerHelper('eq', function (a, b) {
    return a === b;
  });
  
  hbs.registerHelper('formatDate', function (date: Date) {
    if (!date) return '-';
    return new Date(date).toLocaleString('fa-IR');
  });
  
  hbs.registerHelper('json', function (obj) {
    return JSON.stringify(obj, null, 2);
  });

  // ✅ استفاده از PORT environment variable
  const port = process.env.PORT || 10000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
