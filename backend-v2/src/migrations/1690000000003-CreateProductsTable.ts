import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsTable1690000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'min_order', type: 'int', default: 1 },
          { name: 'status', type: 'enum', enum: ['active', 'inactive'], default: `'active'` },
          { name: 'supplierId', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

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
    const table = await queryRunner.getTable('products');
    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('supplierId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('products', foreignKey);
    }
    await queryRunner.dropTable('products');
  }
}
