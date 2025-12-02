import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CmsModule } from './cms/cms.module';
import { AdminModule } from './admin/admin.module';
import { SellersModule } from './sellers/sellers.module';
import { TestModule } from './test/test.module'; // اضافه شد

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
    CmsModule,
    AdminModule,
    SellersModule,
    TestModule, // اضافه شد
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
