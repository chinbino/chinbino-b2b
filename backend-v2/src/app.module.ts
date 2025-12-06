// src/app.module.ts
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
import { TestModule } from './test/test.module';
// import { SuppliersModule } from './suppliers/suppliers.module'; // ❌ کامنت شد
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ProductsModule,
    UsersModule,
    AuthModule,
    CmsModule,
    AdminModule,
    SellersModule,
    TestModule,
    // SuppliersModule, // ❌ کامنت شد
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
