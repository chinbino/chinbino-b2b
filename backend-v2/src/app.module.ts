// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        
        // از Environment Variables جدید استفاده می‌کنیم
        host: configService.get('DB_HOST', 'dpg-d4g9sqhr0fns739fcjug-a.render.com'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'chinbino_user'),
        password: configService.get('DB_PASSWORD', 'FwL7Hjpq8YMA0y8hmNKX20JLlK4eo43C'),
        database: configService.get('DB_NAME', 'chinbino'),
        
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
        
        ssl: { rejectUnauthorized: false },
        
        extra: {
          max: 10,
          connectionTimeoutMillis: 10000,
        },
        
        logging: ['error', 'warn'],
      }),
    }),
    
    AuthModule,
    UsersModule,
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
