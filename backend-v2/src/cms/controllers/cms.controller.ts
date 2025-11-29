import { Controller, Get } from '@nestjs/common';

@Controller('cms')
export class CmsController {
  @Get()
  getInfo() {
    return {
      message: 'CMS Module is working',
      version: '1.0.0'
    };
  }
}
