// src/sellers/entities/seller.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name_zh: string;

  @Column({ nullable: true })
  name_fa: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  wechat_id: string;

  @Column({ nullable: true })
  aliwangwang_id: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { nullable: true })
  description_zh: string;

  @Column('text', { nullable: true })
  description_fa: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
