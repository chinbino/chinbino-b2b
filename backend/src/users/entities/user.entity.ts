import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['fa', 'zh'],
    default: 'fa'
  })
  preferredLanguage: string;

  @Column({
    type: 'enum', 
    enum: ['IRR', 'CNY'],
    default: 'IRR'
  })
  preferredCurrency: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  // اطلاعات فروشنده
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
