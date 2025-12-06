// src/app.module.ts (بخش TypeORM)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'chinbino',
      
      // autoLoadEntities باید true باشد
      autoLoadEntities: true,
      
      // در production همیشه false
      synchronize: false,
      
      // migrationها اجرا شوند
      migrationsRun: true,
      
      // مسیر migrationها
      migrations: ['dist/migrations/*.js'],
      
      // لاگ‌گیری
      logging: process.env.NODE_ENV === 'development',
    }),
    
    AuthModule,
    UsersModule,
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
