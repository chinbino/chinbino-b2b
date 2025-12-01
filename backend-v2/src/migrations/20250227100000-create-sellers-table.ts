import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSellersTable20250227100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sellers',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name_zh', type: 'varchar', length: '255' },
          { name: 'name_fa', type: 'varchar', length: '255', isNullable: true },
          { name: 'company_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'contact_person', type: 'varchar', length: '255', isNullable: true },
          { name: 'phone', type: 'varchar', length: '100', isNullable: true },
          { name: 'wechat_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'aliwangwang_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'location', type: 'varchar', length: '255', isNullable: true },
          { name: 'description_zh', type: 'text', isNullable: true },
          { name: 'description_fa', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sellers', true);
  }
}
