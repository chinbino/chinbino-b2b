import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './controllers/content.controller';
import { ContentService } from './services/content.service';
import { BlockRendererService } from './services/block-renderer.service';
import { Content } from './entities/content.entity';
import { ContentRevision } from './entities/content-revision.entity';
import { Asset } from './entities/asset.entity';
import { BlockType } from './entities/block-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, ContentRevision, Asset, BlockType]),
  ],
  controllers: [ContentController],
  providers: [ContentService, BlockRendererService],
  exports: [ContentService],
})
export class CmsModule {}
