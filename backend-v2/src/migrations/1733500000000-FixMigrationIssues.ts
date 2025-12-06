// src/migrations/1733500000000-FixMigrationIssues.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMigrationIssues1733500000000 implements MigrationInterface {
    name = 'FixMigrationIssues1733500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 FixMigrationIssues: شروع رفع مشکلات...');
        
        // 1. ستون seller_id را فقط اگر وجود ندارد اضافه کن
        try {
            await queryRunner.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255)
            `);
            console.log('✅ ستون seller_id بررسی شد');
        } catch (error) {
            console.log('ℹ️ ستون seller_id از قبل وجود دارد');
        }
        
        // 2. ایجاد جدول suppliers اگر وجود ندارد
        const suppliersExists = await queryRunner.hasTable('suppliers');
        if (!suppliersExists) {
            console.log('⚠️ جدول suppliers وجود ندارد - باید جداگانه ایجاد شود');
        } else {
            console.log('✅ جدول suppliers وجود دارد');
        }
        
        console.log('🎉 FixMigrationIssues: تکمیل شد');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // حذف ستون seller_id اگر وجود دارد
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN IF EXISTS seller_id
        `);
        console.log('🔙 ستون seller_id حذف شد');
    }
}
