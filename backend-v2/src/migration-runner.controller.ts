// src/migration-runner.controller.ts
import { Controller, Post, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { 
  CreateProductsTable1690000000005 
} from './migrations/1690000000005-CreateProductsTable';
import { 
  FixMigrationIssues1733500000000 
} from './migrations/1733500000000-FixMigrationIssues';
import { 
  AddMultiVendorOrderSystem1742998500000 
} from './migrations/1742998500000-AddMultiVendorOrderSystem';
import { 
  CreateSuppliersSimple1745000000000 
} from './migrations/1745000000000-CreateSuppliersSimple';
import { 
  CreateOrderAndOrderItem1750000000000 
} from './migrations/1750000000000-CreateOrderAndOrderItem';

@Controller('run-migrations')
export class MigrationRunnerController {
  private readonly logger = new Logger(MigrationRunnerController.name);

  constructor(private readonly dataSource: DataSource) {}

  @Post()
  async runMigrations() {
    this.logger.log('🚀 شروع اجرای Migrationها...');

    const migrations = [
      new CreateProductsTable1690000000005(),
      new FixMigrationIssues1733500000000(),
      new AddMultiVendorOrderSystem1742998500000(),
      new CreateSuppliersSimple1745000000000(),
      new CreateOrderAndOrderItem1750000000000(),
    ];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    for (const migration of migrations) {
      try {
        this.logger.log(`🔹 اجرای: ${migration.constructor.name}`);
        await migration.up(queryRunner);
        this.logger.log(`✅ موفق: ${migration.constructor.name}`);
      } catch (error) {
        this.logger.error(`❌ خطا در ${migration.constructor.name}:`, error);
        await queryRunner.release();
        return { success: false, message: `خطا در ${migration.constructor.name}`, error };
      }
    }

    await queryRunner.release();
    this.logger.log('🎉 همه Migrationها با موفقیت اجرا شدند!');
    return { success: true, message: 'تمام Migrationها اجرا شدند' };
  }
}
