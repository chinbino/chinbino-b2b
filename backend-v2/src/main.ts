import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
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
