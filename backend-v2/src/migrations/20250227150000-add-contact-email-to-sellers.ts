import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactEmailToSellers20250227150000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sellers 
      ADD COLUMN contact_email VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sellers 
      DROP COLUMN contact_email
    `);
  }
}
