import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSellersController } from './controllers/admin-sellers.controller';
import { AdminContentsController } from './controllers/admin-contents.controller'; // این هم import شود
import { SellersModule } from '../sellers/sellers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    SellersModule,
  ],
  controllers: [
    AdminSellersController,
    AdminContentsController, // این هم اضافه شود
  ],
  providers: [],
})
export class AdminModule {}
