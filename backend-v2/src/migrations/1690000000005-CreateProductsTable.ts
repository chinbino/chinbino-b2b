import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1690000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ✅ 1. اگر جدول products وجود داشت، دیگه چیزی نساز
    const tableExists = await queryRunner.query(`
      SELECT to_regclass('public.products');
    `);

    if (tableExists[0].to_regclass) {
      console.log("⚠️ products table already exists, skipping creation.");
      return;
    }

    // ✅ 2. ساخت جدول products فقط اگر وجود نداشت
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "price" numeric(12,2) NOT NULL,
        "stock" int NOT NULL DEFAULT 0,
        "min_order" int NOT NULL DEFAULT 1,
        "status" varchar NOT NULL DEFAULT 'active',
        "supplierId" uuid NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // ✅ 3. اگر جدول suppliers وجود داشت، FK اضافه شود
    const supplierExists = await queryRunner.query(`
      SELECT to_regclass('public.suppliers');
    `);

    if (supplierExists[0].to_regclass) {
      await queryRunner.query(`
        ALTER TABLE "products"
        ADD CONSTRAINT "FK_products_supplier"
        FOREIGN KEY ("supplierId")
        REFERENCES "suppliers"("id")
        ON DELETE SET NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
