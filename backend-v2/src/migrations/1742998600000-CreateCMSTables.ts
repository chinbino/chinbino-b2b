// src/migrations/1742998600000-CreateCMSTables.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCMSTables1742998600000 implements MigrationInterface {
    name = 'CreateCMSTables1742998600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('🔄 CreateCMSTables: Checking if tables exist...');
        
        // 1. بررسی کن جدول assets وجود دارد یا نه
        const assetsTableExists = await queryRunner.hasTable('assets');
        
        if (!assetsTableExists) {
            await queryRunner.query(`
                CREATE TABLE "assets" (
                    "id" BIGSERIAL NOT NULL,
                    "filename" text NOT NULL,
                    "mime_type" text,
                    "width" int,
                    "height" int,
                    "size" bigint,
                    "url" text NOT NULL,
                    "metadata" jsonb,
                    "created_at" timestamptz NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id")
                )
            `);
            console.log('✅ Created assets table');
        } else {
            console.log('⏭️ assets table already exists - skipping');
        }
        
        // 2. همین کار را برای بقیه tables انجام بده
        const pagesTableExists = await queryRunner.hasTable('pages');
        
        if (!pagesTableExists) {
            await queryRunner.query(`
                CREATE TABLE "pages" (
                    "id" BIGSERIAL NOT NULL,
                    "slug" text NOT NULL,
                    "title" text NOT NULL,
                    "content" text,
                    "meta_title" text,
                    "meta_description" text,
                    "is_published" boolean DEFAULT false,
                    "published_at" timestamptz,
                    "created_at" timestamptz NOT NULL DEFAULT now(),
                    "updated_at" timestamptz NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_6c24c6c8c3a5b8a4b8e4f4e4f4e" PRIMARY KEY ("id")
                )
            `);
            console.log('✅ Created pages table');
        } else {
            console.log('⏭️ pages table already exists - skipping');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "pages"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "assets"`);
    }
}
