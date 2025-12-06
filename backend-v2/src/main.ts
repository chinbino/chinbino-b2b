// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors();
    
    const port = process.env.PORT || 10000;
    await app.listen(port);
    
    logger.log(`🚀 Server running on port ${port}`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV}`);
    logger.log(`🗄️ Using DATABASE_URL: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
