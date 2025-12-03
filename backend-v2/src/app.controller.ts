import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return '🚀 ChinBino B2B Backend V2 - Clean Architecture';
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'ChinBino B2B API V2',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('db-health')
  async checkDbHealth() {
    try {
      // تست اتصال به دیتابیس
      await this.dataSource.query('SELECT 1');
      
      // گرفتن اطلاعات دیتابیس
      const dbInfo = await this.dataSource.query(
        'SELECT current_database() as db, version() as version, current_user as user'
      );

      return {
        status: 'OK',
        message: 'Database connected successfully',
        database: dbInfo[0].db,
        user: dbInfo[0].user,
        version: dbInfo[0].version.split(' ')[1], // فقط شماره نسخه
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };
    }
  }

  @Get('db-tables')
  async getDatabaseTables() {
    try {
      // فقط در محیط development اجازه دسترسی
      if (process.env.NODE_ENV === 'production') {
        return {
          status: 'RESTRICTED',
          message: 'This endpoint is only available in development mode',
          timestamp: new Date().toISOString(),
        };
      }

      // گرفتن لیست جداول
      const tables = await this.dataSource.query(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      // گرفتن آمار هر جدول
      const tablesWithStats = await Promise.all(
        tables.map(async (table: any) => {
          const countResult = await this.dataSource.query(
            `SELECT COUNT(*) FROM "${table.table_name}"`
          );
          return {
            name: table.table_name,
            type: table.table_type,
            rowCount: parseInt(countResult[0].count),
          };
        })
      );

      return {
        status: 'OK',
        tables: tablesWithStats,
        totalTables: tablesWithStats.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Failed to fetch tables',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('app-info')
  getAppInfo() {
    return {
      appName: 'ChinBino B2B Platform',
      version: '2.0.0',
      phase: 'C2.2 - Authentication Development',
      database: {
        type: 'PostgreSQL',
        provider: process.env.DATABASE_URL?.includes('render.com') 
          ? 'Render PostgreSQL' 
          : 'Unknown',
        status: 'Connected',
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
