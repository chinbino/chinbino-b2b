// src/database/migrations/1712000000000-CreateSuppliersTable.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSuppliersTable1712000000000 implements MigrationInterface {
    name = 'CreateSuppliersTable1712000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ایجاد جدول suppliers
        await queryRunner.query(`
            CREATE TABLE "suppliers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "companyName" character varying NOT NULL,
                "businessEmail" character varying NOT NULL,
                "phone" character varying,
                "country" character varying NOT NULL,
                "description" text,
                "verificationStatus" character varying NOT NULL DEFAULT 'pending',
                "verifiedAt" TIMESTAMP,
                "businessLicenseNumber" character varying,
                "taxId" character varying,
                "rating" integer NOT NULL DEFAULT '0',
                "totalReviews" integer NOT NULL DEFAULT '0',
                "isActive" boolean NOT NULL DEFAULT true,
                "user_id" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_suppliers_businessEmail" UNIQUE ("businessEmail"),
                CONSTRAINT "PK_suppliers_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_suppliers_user" FOREIGN KEY ("user_id") 
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // ایجاد ایندکس‌ها
        await queryRunner.query(`
            CREATE INDEX "IDX_suppliers_verificationStatus" ON "suppliers" ("verificationStatus")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_suppliers_country" ON "suppliers" ("country")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_suppliers_user_id" ON "suppliers" ("user_id")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_suppliers_isActive" ON "suppliers" ("isActive")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // حذف ایندکس‌ها
        await queryRunner.query(`DROP INDEX "IDX_suppliers_isActive"`);
        await queryRunner.query(`DROP INDEX "IDX_suppliers_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_suppliers_country"`);
        await queryRunner.query(`DROP INDEX "IDX_suppliers_verificationStatus"`);
        
        // حذف جدول
        await queryRunner.query(`DROP TABLE "suppliers"`);
    }
}
