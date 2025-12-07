
import { MigrationInterface, QueryRunner } from "typeorm";

export class DropProductsTable1690000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "products" CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // rollback لازم ندارد
  }
}
