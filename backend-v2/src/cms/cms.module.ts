import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentRevision } from './entities/content-revision.entity';
import { ContentService } from './services/content.service';
import { BlockRendererService } from './services/block-renderer.service';
import { RenderController } from './controllers/render.controller';
import { PublicPagesController } from './controllers/public-pages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, ContentRevision]),
  ],
  controllers: [
    RenderController, 
    PublicPagesController
  ],
  providers: [ContentService, BlockRendererService],
  exports: [ContentService, BlockRendererService],
})
export class CmsModule {}
