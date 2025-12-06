// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('🚀 Starting Chinbino B2B Backend...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    const port = process.env.PORT || 10000;
    await app.listen(port);
    
    logger.log(`✅ Server running on port ${port}`);
    logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Log database connection status
    if (process.env.DATABASE_URL) {
      const dbUrl = process.env.DATABASE_URL;
      const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
      logger.log(`🗄️ Database URL: ${maskedUrl}`);
    } else {
      logger.warn('⚠️ DATABASE_URL not set in environment');
    }
    
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
