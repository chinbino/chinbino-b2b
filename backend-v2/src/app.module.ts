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
        
        console.log('🔧 DATABASE_URL from env:', databaseUrl ? 'Present' : 'Missing');
        
        if (databaseUrl) {
          try {
            // پارس کردن DATABASE_URL - راه‌حل سازگار
            const urlWithoutProtocol = databaseUrl.replace('postgresql://', '');
            const [credentials, hostAndDb] = urlWithoutProtocol.split('@');
            const [username, password] = credentials.split(':');
            const [hostPort, database] = hostAndDb.split('/');
            const [host, port] = hostPort.split(':');
            
            console.log('🔧 Parsed connection details:');
            console.log('   Host:', host);
            console.log('   Port:', port);
            console.log('   Database:', database);
            
            return {
              type: 'postgres',
              host: host,
              port: parseInt(port || '5432'),
              username: username,
              password: password,
              database: database,
              
              autoLoadEntities: true,
              synchronize: false,
              migrationsRun: true,
              migrations: ['dist/migrations/*.js'],
              
              // SSL برای Render
              ssl: { rejectUnauthorized: false },
              
              // Connection settings
              extra: {
                max: 10,
                connectionTimeoutMillis: 10000,
              },
              
              // Logging
              logging: ['error', 'warn'],
            };
          } catch (error) {
            console.error('❌ Error parsing DATABASE_URL:', error.message);
            console.error('❌ DATABASE_URL was:', databaseUrl);
          }
        }
        
        console.log('⚠️ Using fallback connection settings');
        
        // Fallback: اگر DATABASE_URL نبود یا parse نشد
        return {
          type: 'postgres',
          host: 'dpg-d4g9sqhr0fns739fcjug-a', // بدون .render.com
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
          
          logging: ['error', 'warn', 'query'],
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
