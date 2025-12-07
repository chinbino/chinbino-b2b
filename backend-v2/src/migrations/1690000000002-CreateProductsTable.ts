import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsTable1690000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ ساخت جدول products با ستون supplierId
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'min_order', type: 'int', default: 1 },
          { name: 'status', type: 'enum', enum: ['active', 'inactive'], default: `'active'` },
          { name: 'supplierId', type: 'uuid' }, // ستون Foreign Key
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 2️⃣ اضافه کردن Foreign Key بعد از اینکه ستون supplierId موجود است
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
    await queryRunner.dropTable('products', true);
  }
}
