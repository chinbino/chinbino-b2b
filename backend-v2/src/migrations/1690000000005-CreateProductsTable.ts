import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1690000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text,
        "price" numeric(12,2) NOT NULL,
        "stock" int NOT NULL DEFAULT 0,
        "min_order" int NOT NULL DEFAULT 1,
        "status" varchar NOT NULL DEFAULT 'active',
        "supplierId" uuid NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "products"
      ADD CONSTRAINT "FK_products_supplier"
      FOREIGN KEY ("supplierId")
      REFERENCES "suppliers"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
