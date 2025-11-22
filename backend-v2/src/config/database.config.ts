import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  ssl: true,  // ✅ تغییر به true
  extra: {
    ssl: {
      rejectUnauthorized: false,  // ✅ اضافه شد
    },
  },
  logging: process.env.NODE_ENV === 'development',
}));
