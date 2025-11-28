import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CmsModule } from './cms/cms.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CmsModule, // ✅ فعال شد
  ],
  controllers: [AppController],
})
export class AppModule {}
