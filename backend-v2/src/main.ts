import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 🔴 فعال کردن Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    disableErrorMessages: false,
    validationError: {
      target: false,
      value: false,
    }
  }));
  
  // ✅ تنظیم Handlebars - مسیر اصلاح شد
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'admin', 'views')); // اصلاح شد
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

  // Helperهای جدید برای pagination و مقایسه
  hbs.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  hbs.registerHelper('gt', function(a, b) {
    return a > b;
  });

  hbs.registerHelper('lt', function(a, b) {
    return a < b;
  });

  hbs.registerHelper('add', function(a, b) {
    return a + b;
  });

  hbs.registerHelper('subtract', function(a, b) {
    return a - b;
  });

  // ✅ استفاده از PORT environment variable
  const port = process.env.PORT || 10000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
