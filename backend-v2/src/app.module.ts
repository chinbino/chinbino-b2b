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
      useFactory: (configService: ConfigService) => {
        // گرفتن DATABASE_URL از محیط
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          try {
            // پارس کردن DATABASE_URL
            const url = new URL(databaseUrl);
            
            return {
              type: 'postgres',
              host: url.hostname,
              port: parseInt(url.port),
              username: url.username,
              password: url.password,
              database: url.pathname.replace('/', ''),
              
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
            };
          } catch (error) {
            console.error('Error parsing DATABASE_URL:', error);
          }
        }
        
        // Fallback: اگر DATABASE_URL نبود یا parse نشد
        return {
          type: 'postgres',
          host: 'dpg-d4g9sqhr0fns739fcjug-a',
          port: 5432,
          username: 'chinbino_user',
          password: 'FwL7Hjpq8YMA0y8hmNKX20JLlK4eo43C',
          database: 'chinbino',
          
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
        };
      },
    }),
    
    AuthModule,
    UsersModule,
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
