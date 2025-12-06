// src/sellers/entities/seller.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

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

  @Column({
    type: 'enum',
    enum: SellerStatus,
    default: SellerStatus.PENDING
  })
  status: SellerStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
