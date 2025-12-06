// src/suppliers/entities/supplier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'business_email', unique: true })
  businessEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'iran' })
  country: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'verification_status', default: 'pending' })
  verificationStatus: string;

  @Column({ name: 'user_id' })  // ← مهمترین تغییر
  userId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
