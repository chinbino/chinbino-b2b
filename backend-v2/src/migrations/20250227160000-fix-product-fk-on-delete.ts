import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProductFkOnDelete20250227160000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ۱. ابتدا constraintهای موجود را پیدا و حذف کنیم
    const constraints = await queryRunner.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = 'product'::regclass 
      AND confrelid = 'sellers'::regclass
    `);

    // حذف تمام constraintهای مرتبط
    for (const constraint of constraints) {
      await queryRunner.query(`
        ALTER TABLE product 
        DROP CONSTRAINT IF EXISTS "${constraint.conname}"
      `);
    }

    // ۲. ایجاد constraint جدید با ON DELETE SET NULL
    await queryRunner.query(`
      ALTER TABLE product 
      ADD CONSTRAINT fk_product_seller_id 
      FOREIGN KEY (seller_id) 
      REFERENCES sellers(id) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    console.log('✅ Foreign key constraint updated to ON DELETE SET NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف constraint جدید
    await queryRunner.query(`
      ALTER TABLE product 
      DROP CONSTRAINT IF EXISTS fk_product_seller_id
    `);

    // ایجاد constraint بدون ON DELETE SET NULL (حالت قبلی)
    await queryRunner.query(`
      ALTER TABLE product 
      ADD CONSTRAINT fk_product_seller_id 
      FOREIGN KEY (seller_id) 
      REFERENCES sellers(id)
    `);

    console.log('✅ Foreign key constraint reverted to default');
  }
}
