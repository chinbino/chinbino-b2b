// src/migrations/1742998500000-AddMultiVendorOrderSystem.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMultiVendorOrderSystem1742998500000 implements MigrationInterface {
    name = 'AddMultiVendorOrderSystem1742998500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 AddMultiVendorOrderSystem: Starting...');
        
        // 1. اول ستون را با مقدار DEFAULT اضافه کن
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ADD "totalProductsCNY" decimal(12,2) DEFAULT 0.00
        `);
        
        // 2. سپس NOT NULL constraint اضافه کن
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ALTER COLUMN "totalProductsCNY" SET NOT NULL
        `);
        
        // 3. مقدار DEFAULT را حذف کن
        await queryRunner.query(`
            ALTER TABLE "orders" 
            ALTER COLUMN "totalProductsCNY" DROP DEFAULT
        `);
        
        console.log('✅ AddMultiVendorOrderSystem: Completed');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "totalProductsCNY"`);
    }
}
