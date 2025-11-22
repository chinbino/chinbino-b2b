import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '🚀 ChinBino B2B Backend V2 - Clean Architecture';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'ChinBino B2B API V2',
      timestamp: new Date().toISOString(),
    };
  }
}
