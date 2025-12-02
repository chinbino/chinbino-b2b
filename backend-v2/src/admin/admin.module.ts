import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSellersController } from './controllers/admin-sellers.controller';
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    SellersModule,
  ],
  controllers: [
    AdminSellersController,
  ],
  providers: [],
})
export class AdminModule {}
