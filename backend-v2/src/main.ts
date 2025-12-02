import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { existsSync, readdirSync, readFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  console.log('🔍 ========== تنظیم Handlebars ==========');
  
  // مسیر views
  const viewsPath = join(__dirname, 'admin/views');
  console.log('📁 مسیر views:', viewsPath);
  console.log('📁 وجود دارد:', existsSync(viewsPath));
  
  if (existsSync(viewsPath)) {
    // لیست فایل‌ها
    const files = readdirSync(viewsPath);
    console.log('📄 فایل‌های views:', files.join(', '));
  }
  
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');
  
  // ثبت Handlebars helpers و partials
  const hbs = require('hbs');
  
  // Helper برای مقایسه
  hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
  
  // Helper برای if cond
  hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  
  // Helper برای فرمت تاریخ
  hbs.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('fa-IR');
  });
  
  // ثبت partials
  try {
    const partialsDir = viewsPath;
    if (existsSync(partialsDir)) {
      const files = readdirSync(partialsDir);
      
      files.forEach(file => {
        if (file.endsWith('.hbs') && file !== 'layouts' && !file.startsWith('layouts/')) {
          const partialName = file.replace('.hbs', '');
          const partialPath = join(partialsDir, file);
          const partialContent = readFileSync(partialPath, 'utf8');
          hbs.registerPartial(partialName, partialContent);
          console.log(`✅ ثبت partial: ${partialName}`);
        }
      });
      
      // ثبت layout
      const layoutPath = join(partialsDir, 'layouts/main.hbs');
      if (existsSync(layoutPath)) {
        const layoutContent = readFileSync(layoutPath, 'utf8');
        hbs.registerPartial('main', layoutContent);
        console.log('✅ ثبت layout: main');
      }
    }
  } catch (error) {
    console.log('⚠️ خطا در ثبت partials:', error.message);
  }
  
  console.log('✅ Handlebars پیکربندی شد');
  console.log('=========================================\n');
  
  // Middleware برای log
  app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
  });
  
  const port = process.env.PORT || 10000;
  await app.listen(port);
  
  console.log('\n✅ ========== سرور اجرا شد ==========');
  console.log(`🌐 پورت: ${port}`);
  console.log(`🛒 پنل ادمین: http://localhost:${port}/admin/sellers`);
  console.log(`📁 مسیر views: ${viewsPath}`);
  console.log('=====================================\n');
}

bootstrap();
