import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForceSetNullOnDelete20250227170000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ۱. ابتدا تمام products با seller_id = 1 را به null تبدیل می‌کنیم (کار دستی)
    await queryRunner.query(`
      UPDATE product 
      SET seller_id = NULL 
      WHERE seller_id = 1
    `);

    console.log('✅ Updated all products with seller_id=1 to NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // برگرداندن (اختیاری)
    await queryRunner.query(`
      UPDATE product 
      SET seller_id = 1 
      WHERE id = 'e48123b3-a54d-4f46-83c4-aca6646d6fa7'
    `);
  }
}
