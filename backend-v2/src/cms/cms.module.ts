import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentRevision } from './entities/content-revision.entity';
import { ContentService } from './services/content.service';
import { BlockRendererService } from './services/block-renderer.service';
import { CmsController } from './controllers/cms.controller';
import { RenderController } from './controllers/render.controller';
import { PublicPagesController } from './controllers/public-pages.controller'; // اضافه شود

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, ContentRevision]),
  ],
  controllers: [
    CmsController, 
    RenderController, 
    PublicPagesController // اضافه شود
  ],
  providers: [ContentService, BlockRendererService],
  exports: [ContentService, BlockRendererService],
})
export class CmsModule {}
