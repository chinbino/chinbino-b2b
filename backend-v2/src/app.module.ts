import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module'; // اضافه کردن این خط

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... تنظیمات موجود
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ProductsModule,
    UsersModule, 
    AuthModule,
    OrdersModule, // اضافه کردن این خط
  ],
  controllers: [AppController],
})
export class AppModule {}
