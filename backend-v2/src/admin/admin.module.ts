import { Module } from '@nestjs/common';
import { AdminSellersController } from './controllers/admin-sellers.controller';

@Module({
  controllers: [AdminSellersController]
})
export class AdminModule {
  // constructor حذف شده
}
