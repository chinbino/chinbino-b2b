import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAllFkIssues20250227180000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🚀 Starting comprehensive FK fix migration...');

    // ۱. ابتدا تمام products مربوط به sellers deleted را به null تبدیل می‌کنیم
    console.log('Step 1: Setting seller_id to NULL for deleted sellers...');
    await queryRunner.query(`
      UPDATE product 
      SET seller_id = NULL 
      WHERE seller_id IN (
        SELECT id FROM sellers WHERE deleted_at IS NOT NULL
      )
    `);
    console.log('✅ Step 1 completed');

    // ۲. حذف تمام constraintهای موجود (با try/catch برای ایمنی)
    console.log('Step 2: Removing existing FK constraints...');
    const dropConstraints = `
      DO $$ 
      BEGIN
        -- Drop all possible constraint names
        ALTER TABLE product DROP CONSTRAINT IF EXISTS "FK_product_seller";
        ALTER TABLE product DROP CONSTRAINT IF EXISTS "fk_product_seller_id";
        ALTER TABLE product DROP CONSTRAINT IF EXISTS "product_seller_id_fkey";
        ALTER TABLE product DROP CONSTRAINT IF EXISTS "FK_product_seller_set_null";
        ALTER TABLE product DROP CONSTRAINT IF EXISTS "FK_product_seller_on_delete_set_null";
      EXCEPTION
        WHEN undefined_table OR undefined_object THEN
          -- Ignore errors if table or constraint doesn't exist
          NULL;
      END $$;
    `;
    await queryRunner.query(dropConstraints);
    console.log('✅ Step 2 completed');

    // ۳. ایجاد constraint جدید با ON DELETE SET NULL
    console.log('Step 3: Creating new FK constraint with ON DELETE SET NULL...');
    await queryRunner.query(`
      ALTER TABLE product 
      ADD CONSTRAINT "FK_product_seller_cascade_null" 
      FOREIGN KEY (seller_id) 
      REFERENCES sellers(id) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);
    console.log('✅ Step 3 completed');

    // ۴. همچنین برای users table (اگر نیاز باشد)
    console.log('Step 4: Checking users table FK...');
    try {
      await queryRunner.query(`
        ALTER TABLE users 
        DROP CONSTRAINT IF EXISTS "FK_users_seller"
      `);
      
      await queryRunner.query(`
        ALTER TABLE users 
        ADD CONSTRAINT "FK_users_seller_cascade_null" 
        FOREIGN KEY (seller_id) 
        REFERENCES sellers(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
      `);
      console.log('✅ Step 4 completed (users table updated)');
    } catch (error) {
      console.log('⚠️ Step 4 skipped (users FK might not exist or different name)');
    }

    console.log('🎉 Migration completed successfully!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // فقط constraintهای جدید را بردار
    await queryRunner.query(`
      ALTER TABLE product 
      DROP CONSTRAINT IF EXISTS "FK_product_seller_cascade_null"
    `);
    
    await queryRunner.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS "FK_users_seller_cascade_null"
    `);
    
    console.log('✅ Migration reverted');
  }
}
