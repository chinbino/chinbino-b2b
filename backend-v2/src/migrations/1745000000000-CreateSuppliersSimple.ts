// src/migrations/1745000000000-CreateSuppliersSimple.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSuppliersSimple1745000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ساخت جدول ساده‌تر بدون conflict
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS suppliers_simple (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "companyName" VARCHAR NOT NULL,
                "businessEmail" VARCHAR UNIQUE NOT NULL,
                "country" VARCHAR NOT NULL DEFAULT 'iran',
                "verificationStatus" VARCHAR NOT NULL DEFAULT 'pending',
                "userId" uuid REFERENCES users(id) ON DELETE CASCADE,
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS suppliers_simple`);
    }
}
