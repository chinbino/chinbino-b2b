import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminSellersController } from './controllers/admin-sellers.controller'; // اضافه شد
import { AdminContentsController } from './controllers/admin-contents.controller';
import { SellersModule } from '../sellers/sellers.module'; // اضافه شد

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    SellersModule, // اضافه شد - برای دسترسی به SellersService
  ],
  controllers: [
    AdminController,
    AdminSellersController, // اضافه شد
    AdminContentsController,
  ],
  providers: [],
})
export class AdminModule {}
