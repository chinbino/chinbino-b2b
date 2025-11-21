import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  
  @Get()
  getHello(): string {
    return '🚀 ChinBino B2B Backend is Running!';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'ChinBino B2B API'
    };
  }

  @Get('api')
  getApiInfo(): object {
    return {
      name: 'ChinBino B2B Platform',
      version: '1.0.0',
      description: 'China-Iran B2B Marketplace',
      endpoints: [
        '/health',
        '/api',
        '/products'
      ]
    };
  }
}
