import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTestSeller20250227130000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ایجاد Seller تستی
    await queryRunner.query(`
      INSERT INTO sellers (
        name_zh, 
        name_fa, 
        company_name, 
        contact_person, 
        phone, 
        location,
        description_zh,
        description_fa,
        created_at, 
        updated_at
      ) VALUES (
        '义乌测试供应商有限公司',
        'شرکت تأمین‌کننده تست ییوو',
        '义乌测试贸易有限公司',
        '张测试',
        '+8613812345678',
        '中国浙江省义乌市福田市场一区',
        '专业的义乌供应商，提供优质商品',
        'تأمین‌کننده حرفه‌ای در ییوو، ارائه کالای باکیفیت',
        NOW(),
        NOW()
      )
    `);
    
    console.log('✅ Test seller inserted successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM sellers WHERE name_zh = '义乌测试供应商有限公司'
    `);
    console.log('✅ Test seller removed');
  }
}
