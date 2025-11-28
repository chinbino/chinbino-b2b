import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCMSTables1742998600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ایجاد جدول assets
    await queryRunner.createTable(new Table({
      name: 'assets',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'filename',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'mime_type',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'width',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'height',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'size',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'url',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'metadata',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamptz',
          default: 'now()',
        },
      ],
    }));

    // ایجاد جدول block_types
    await queryRunner.createTable(new Table({
      name: 'block_types',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          length: '50',
          isPrimary: true,
        },
        {
          name: 'schema',
          type: 'jsonb',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamptz',
          default: 'now()',
        },
      ],
    }));

    // ایجاد جدول contents
    await queryRunner.createTable(new Table({
      name: 'contents',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'type',
          type: 'varchar',
          length: '50',
          isNullable: false,
        },
        {
          name: 'title',
          type: 'jsonb',
          isNullable: false,
        },
        {
          name: 'slug',
          type: 'text',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'status',
          type: 'varchar',
          length: '20',
          default: "'draft'",
        },
        {
          name: 'author_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'excerpt',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'categories',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'tags',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'locales',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'seo',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'published_at',
          type: 'timestamptz',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamptz',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamptz',
          default: 'now()',
        },
        {
          name: 'main_image_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'blocks',
          type: 'jsonb',
          isNullable: false,
        },
        {
          name: 'rendered_html',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'search_vector',
          type: 'tsvector',
          isNullable: true,
        },
      ],
    }));

    // ایجاد جدول content_revisions
    await queryRunner.createTable(new Table({
      name: 'content_revisions',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'content_id',
          type: 'bigint',
          isNullable: false,
        },
        {
          name: 'blocks',
          type: 'jsonb',
          isNullable: false,
        },
        {
          name: 'seo',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'meta',
          type: 'jsonb',
          isNullable: true,
        },
        {
          name: 'author_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamptz',
          default: 'now()',
        },
      ],
    }));

    // ایجاد ایندکس‌ها
    await queryRunner.createIndex('contents', new TableIndex({
      name: 'IDX_contents_slug',
      columnNames: ['slug'],
    }));

    await queryRunner.createIndex('contents', new TableIndex({
      name: 'IDX_contents_type_status',
      columnNames: ['type', 'status'],
    }));

    await queryRunner.createIndex('contents', new TableIndex({
      name: 'IDX_contents_published_at',
      columnNames: ['published_at'],
    }));

    await queryRunner.createIndex('content_revisions', new TableIndex({
      name: 'IDX_content_revisions_content_id',
      columnNames: ['content_id'],
    }));

    // ایجاد Foreign Keys
    await queryRunner.createForeignKey('contents', new TableForeignKey({
      name: 'FK_contents_author_id',
      columnNames: ['author_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('contents', new TableForeignKey({
      name: 'FK_contents_main_image_id',
      columnNames: ['main_image_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'assets',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('content_revisions', new TableForeignKey({
      name: 'FK_content_revisions_content_id',
      columnNames: ['content_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'contents',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('content_revisions', new TableForeignKey({
      name: 'FK_content_revisions_author_id',
      columnNames: ['author_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    // ایجاد ایندکس جستجوی کامل
    await queryRunner.query(`
      CREATE INDEX IDX_contents_search_vector 
      ON contents USING GIN (search_vector)
    `);

    // ایجاد تریگر برای جستجوی کامل
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION contents_search_vector_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('persian', COALESCE(NEW.title->>'fa', '')), 'A') ||
          setweight(to_tsvector('persian', COALESCE(NEW.excerpt->>'fa', '')), 'B') ||
          to_tsvector('persian', COALESCE(NEW.rendered_html, ''));
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER contents_search_vector_update 
      BEFORE INSERT OR UPDATE ON contents 
      FOR EACH ROW EXECUTE FUNCTION contents_search_vector_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف تریگرها
    await queryRunner.query('DROP TRIGGER IF EXISTS contents_search_vector_update ON contents');
    await queryRunner.query('DROP FUNCTION IF EXISTS contents_search_vector_trigger');

    // حذف ایندکس‌ها
    await queryRunner.dropIndex('content_revisions', 'IDX_content_revisions_content_id');
    await queryRunner.dropIndex('contents', 'IDX_contents_published_at');
    await queryRunner.dropIndex('contents', 'IDX_contents_type_status');
    await queryRunner.dropIndex('contents', 'IDX_contents_slug');
    await queryRunner.dropIndex('contents', 'IDX_contents_search_vector');

    // حذف Foreign Keys
    await queryRunner.dropForeignKey('content_revisions', 'FK_content_revisions_author_id');
    await queryRunner.dropForeignKey('content_revisions', 'FK_content_revisions_content_id');
    await queryRunner.dropForeignKey('contents', 'FK_contents_main_image_id');
    await queryRunner.dropForeignKey('contents', 'FK_contents_author_id');

    // حذف جداول
    await queryRunner.dropTable('content_revisions');
    await queryRunner.dropTable('contents');
    await queryRunner.dropTable('block_types');
    await queryRunner.dropTable('assets');
  }
}
