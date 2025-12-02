import { Module } from '@nestjs/common';
import { AdminSellersController } from './controllers/admin-sellers.controller';
import { join } from 'path';

@Module({
  controllers: [AdminSellersController],
})
export class AdminModule {
  constructor() {
    // تنظیم view engine برای admin
    this.configureViews();
  }

  private configureViews() {
    // این کاس در اصل باید در main.ts باشد، اما برای تست در اینجا قرار می‌دهیم
    const hbs = require('hbs');
    
    // تنظیم مسیر views برای admin
    const adminViewsPath = join(__dirname, 'views');
    console.log('Admin views path:', adminViewsPath);
  }
}
