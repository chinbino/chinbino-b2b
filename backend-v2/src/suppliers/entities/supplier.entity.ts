// src/suppliers/entities/supplier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'companyName' })  // ← name اضافه کنید
  companyName: string;

  @Column({ name: 'businessEmail', unique: true })  // ← name اضافه کنید
  businessEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'iran' })
  country: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'verificationStatus', default: 'pending' })  // ← name اضافه کنید
  verificationStatus: string;

  @Column({ name: 'userId' })  // ← این خط را اضافه کنید
  userId: string;

  @Column({ name: 'isActive', default: true })  // ← name اضافه کنید
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt' })  // ← name اضافه کنید
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })  // ← name اضافه کنید
  updatedAt: Date;
}
