import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/chinbino',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  useUnifiedTopology: true,
  useNewUrlParser: true,
}));
