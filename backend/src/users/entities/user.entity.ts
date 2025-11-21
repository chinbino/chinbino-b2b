import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column()
  role: 'customer' | 'seller' | 'admin';

  @Column()
  preferredLanguage: 'fa' | 'zh';

  @Column()
  preferredCurrency: 'IRR' | 'CNY';

  @Column()
  isActive: boolean;

  @Column()
  emailVerified: boolean;

  @Column()
  phoneVerified: boolean;

  // اطلاعات فروشنده (اگر نقش seller باشد)
  @Column({ nullable: true })
  companyNameZh: string;

  @Column({ nullable: true })
  companyNameFa: string;

  @Column({ nullable: true })
  marketLocation: string;

  @Column({ nullable: true })
  boothNumbers: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
