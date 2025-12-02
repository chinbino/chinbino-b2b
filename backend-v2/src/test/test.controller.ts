import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../sellers/entities/seller.entity';

@Controller('test')
export class TestController {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  @Get('db-check')
  async testDatabaseStructure() {
    try {
      // تست ۱: بررسی وجود جدول sellers
      const sellersCount = await this.sellersRepository.count();
      
      // تست ۲: بررسی ساختار (نمونه‌ای از داده)
      const sampleSeller = await this.sellersRepository.findOne({
        where: {},
        order: { id: 'DESC' }
      });
      
      // تست ۳: بررسی ساختار جدول
      const tableInfo = {
        tableName: 'sellers',
        expectedColumns: 13,
        hasCreatedAt: !!sampleSeller?.createdAt,
        hasUpdatedAt: !!sampleSeller?.updatedAt,
        hasNameZh: !!sampleSeller?.nameZh
      };
      
      return {
        success: true,
        message: 'Phase C1 - Database Tests',
        checks: {
          sellersTableExists: true,
          sellersCount: sellersCount,
          tableStructure: tableInfo,
          sampleSeller: sampleSeller || { message: 'No sellers in database' }
        },
        phase: 'C1 - Seller Entity Implementation',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Database connection failed',
        error: error.message,
        phase: 'C1 - Seller Entity Implementation',
        timestamp: new Date().toISOString()
      };
    }
  }
}
