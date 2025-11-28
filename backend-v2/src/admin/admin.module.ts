import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminContentsController } from './controllers/admin-contents.controller';
import { Content } from '../cms/entities/content.entity';
import { ContentService } from '../cms/services/content.service';
import { BlockRendererService } from '../cms/services/block-renderer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
  ],
  controllers: [AdminContentsController],
  providers: [ContentService, BlockRendererService],
})
export class AdminModule {}
