import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsTable1690000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ابتدا جدول products را بساز
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'min_order', type: 'int', default: 1 },
          { name: 'status', type: 'varchar', default: `'active'` },
          { name: 'supplierId', type: 'uuid' }, // ستون Foreign Key
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // سپس Foreign Key بساز
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['supplierId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
