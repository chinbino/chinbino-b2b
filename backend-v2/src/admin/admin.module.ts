import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSellersController } from './controllers/admin-sellers.controller';
import { AdminContentsController } from './controllers/admin-contents.controller';
import { SellersModule } from '../sellers/sellers.module';
import { CmsModule } from '../cms/cms.module'; // اضافه شد

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    SellersModule,
    CmsModule, // اضافه شد - برای ContentService و BlockRendererService
  ],
  controllers: [
    AdminSellersController,
    AdminContentsController,
  ],
  providers: [],
})
export class AdminModule {}
