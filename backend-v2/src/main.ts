import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync, readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیم Handlebars ==========');
  
  // مسیر views جدید
  const viewsPath = join(__dirname, 'views/admin');
  console.log('📁 مسیر views:', viewsPath);
  console.log('📁 وجود دارد:', existsSync(viewsPath));
  
  if (!existsSync(viewsPath)) {
    console.error('❌ مسیر views یافت نشد!');
    console.log('📁 مسیر جاری:', __dirname);
    console.log('📁 محتوای dist:', readdirSync(join(__dirname)));
  } else {
    const files = readdirSync(viewsPath);
    console.log('📄 فایل‌های موجود:', files.join(', '));
  }
  
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ثبت Handlebars helpers
  const hbs = require('hbs');
  
  // Helper برای مقایسه
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  // Helper برای if
  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      default: return options.inverse(this);
    }
  });
  
  console.log('✅ Handlebars پیکربندی شد');
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
