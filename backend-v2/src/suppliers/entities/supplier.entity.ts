// src/suppliers/entities/supplier.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column({ unique: true })
  businessEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'iran' })
  country: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: 'pending' })
  verificationStatus: string;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
