import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerFields20250227140000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // اضافه کردن ستون‌های جدید
    await queryRunner.query(`
      ALTER TABLE sellers 
      ADD COLUMN status VARCHAR(20) DEFAULT 'pending',
      ADD COLUMN contact_name VARCHAR(255),
      ADD COLUMN contact_phone VARCHAR(100),
      ADD COLUMN wechat_id VARCHAR(255),
      ADD COLUMN deleted_at TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sellers 
      DROP COLUMN status,
      DROP COLUMN contact_name,
      DROP COLUMN contact_phone,
      DROP COLUMN wechat_id,
      DROP COLUMN deleted_at
    `);
  }
}
