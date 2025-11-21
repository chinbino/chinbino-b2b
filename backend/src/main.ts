import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // استفاده از پورت Render یا پورت پیش‌فرض
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 B2B Backend is running on: http://localhost:${port}`);
}
bootstrap();
