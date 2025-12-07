// src/users/entities/user.entity.ts
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
   enum: ['buyer', 'supplier', 'admin'], // seller → supplier
    default: 'buyer'
  })
  role: string;

  @Column({
    type: 'enum', 
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  })
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({
    type: 'enum',
    enum: ['fa', 'zh', 'en'],
    default: 'fa'
  })
  preferredLanguage: string;

  @Column({
    type: 'enum',
    enum: ['CNY', 'IRR', 'USD'],
    default: 'IRR'
  })
  preferredCurrency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
