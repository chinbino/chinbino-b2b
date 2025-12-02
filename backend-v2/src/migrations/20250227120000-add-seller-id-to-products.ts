import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddSellerIdToProducts20250227120000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // اول ستون seller_id را اضافه می‌کنیم
    await queryRunner.query(`
      ALTER TABLE product 
      ADD COLUMN seller_id INT NULL
    `);

    // اضافه کردن foreign key constraint
    await queryRunner.createForeignKey(
      'product',
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
    const table = await queryRunner.getTable('product');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('seller_id') !== -1,
    );
    await queryRunner.dropForeignKey('product', foreignKey);

    // حذف ستون
    await queryRunner.query(`
      ALTER TABLE product 
      DROP COLUMN seller_id
    `);
  }
}
