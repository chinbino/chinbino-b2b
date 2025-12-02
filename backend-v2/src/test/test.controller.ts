import { Controller, Get, Post } from '@nestjs/common';
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
      const sellersCount = await this.sellersRepository.count();
      const sampleSeller = await this.sellersRepository.findOne({
        where: {},
        order: { id: 'DESC' }
      });
      
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

  @Post('create-test-data')
  async createTestData() {
    try {
      // ۱. ایجاد Seller تستی
      const testSeller = this.sellersRepository.create({
        nameZh: '义乌测试供应商有限公司',
        nameFa: 'شرکت تأمین‌کننده تست ییوو',
        companyName: '义乌测试贸易有限公司',
        contactPerson: '张测试',
        phone: '+8613812345678',
        wechatId: 'test_supplier',
        location: '中国浙江省义乌市福田市场一区',
        descriptionZh: '专业的义乌供应商，提供优质商品',
        descriptionFa: 'تأمین‌کننده حرفه‌ای در ییوو، ارائه کالای باکیفیت'
      });
      
      const savedSeller = await this.sellersRepository.save(testSeller);
      
      // ۲. به‌روزرسانی محصول موجود
      const productsRepo = this.sellersRepository.manager.getRepository('Product');
      const existingProduct = await productsRepo.findOne({
        where: { id: 'e48123b3-a54d-4f46-83c4-aca6646d6fa7' }
      });
      
      let productUpdated = false;
      if (existingProduct) {
        await productsRepo.update(existingProduct.id, {
          sellerId: savedSeller.id
        });
        productUpdated = true;
      }
      
      return {
        success: true,
        message: 'Test data created successfully',
        data: {
          seller: savedSeller,
          productUpdated: productUpdated,
          productId: existingProduct?.id
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create test data',
        error: error.message
      };
    }
  }
}
