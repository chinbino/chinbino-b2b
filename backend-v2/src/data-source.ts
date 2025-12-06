// src/data-source.ts
import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chinbino',
  
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  
  // فقط migrationهای زیر را اجرا کن
  migrations: [
    path.join(__dirname, '..', 'migrations', '*.ts'),
  ],
  
  migrationsTableName: 'migrations_history',
  migrationsRun: true,
  
  // تنظیمات اضافی
  logging: process.env.NODE_ENV === 'development',
  synchronize: false,
  
  // connection تنظیمات
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
  },
});
