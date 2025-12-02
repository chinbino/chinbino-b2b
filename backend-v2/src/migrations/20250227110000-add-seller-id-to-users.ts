import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddSellerIdToUsers20250227110000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // اضافه کردن ستون seller_id به جدول users
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN seller_id INT NULL
    `);

    // اضافه کردن foreign key constraint
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['seller_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sellers',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف foreign key
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('seller_id') !== -1,
    );
    await queryRunner.dropForeignKey('users', foreignKey);

    // حذف ستون
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN seller_id
    `);
  }
}
