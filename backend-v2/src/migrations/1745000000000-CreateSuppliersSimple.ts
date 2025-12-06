// src/migrations/1745000000000-CreateSuppliersSimple.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSuppliersSimple1745000000000 implements MigrationInterface {
    name = 'CreateSuppliersSimple1745000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // اول بررسی کن جدول وجود دارد یا نه
        const tableExists = await queryRunner.hasTable('suppliers');
        
        if (!tableExists) {
            await queryRunner.query(`
                CREATE TABLE suppliers (
                    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                    "companyName" VARCHAR NOT NULL,
                    "businessEmail" VARCHAR UNIQUE NOT NULL,
                    phone VARCHAR,
                    country VARCHAR NOT NULL DEFAULT 'iran',
                    description TEXT,
                    "verificationStatus" VARCHAR NOT NULL DEFAULT 'pending',
                    "userId" VARCHAR NOT NULL,
                    "isActive" BOOLEAN DEFAULT true,
                    "createdAt" TIMESTAMP DEFAULT NOW(),
                    "updatedAt" TIMESTAMP DEFAULT NOW()
                )
            `);

            await queryRunner.query(`
                CREATE INDEX idx_suppliers_user_id ON suppliers ("userId")
            `);
            
            await queryRunner.query(`
                CREATE INDEX idx_suppliers_status ON suppliers ("verificationStatus")
            `);
            
            console.log('✅ جدول suppliers ایجاد شد');
        } else {
            console.log('ℹ️ جدول suppliers از قبل وجود دارد - اسکیپ');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_suppliers_status`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_suppliers_user_id`);
        await queryRunner.query(`DROP TABLE IF EXISTS suppliers`);
    }
}
