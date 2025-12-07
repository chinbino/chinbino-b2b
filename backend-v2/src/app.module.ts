// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { OrdersModule } from './orders/orders.module'; // ✅ اتصال ماژول سفارش‌ها

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        const connectionConfig: any = {
          type: 'postgres',
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

        if (databaseUrl) {
          try {
            const urlWithoutProtocol = databaseUrl.replace('postgresql://', '');
            const [credentials, hostAndDb] = urlWithoutProtocol.split('@');
            const [username, password] = credentials.split(':');
            const [hostPort, database] = hostAndDb.split('/');
            const [host, port] = hostPort.split(':');

            connectionConfig.host = host;
            connectionConfig.port = parseInt(port || '5432');
            connectionConfig.username = username;
            connectionConfig.password = password;
            connectionConfig.database = database;
          } catch (error) {
            connectionConfig.host = 'dpg-d4g9sqhr0fns739fcjug-a';
            connectionConfig.port = 5432;
            connectionConfig.username = 'chinbino_user';
            connectionConfig.password = 'FwL7Hjpq8YMA0y8hmNKX20JLlK4eo43C';
            connectionConfig.database = 'chinbino';
          }
        } else {
          connectionConfig.host = 'dpg-d4g9sqhr0fns739fcjug-a';
          connectionConfig.port = 5432;
          connectionConfig.username = 'chinbino_user';
          connectionConfig.password = 'FwL7Hjpq8YMA0y8hmNKX20JLlK4eo43C';
          connectionConfig.database = 'chinbino';
        }

        return connectionConfig;
      },
    }),

    AuthModule,
    UsersModule,
    SuppliersModule,
    OrdersModule, // ✅ فعال شد
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
