export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // اطلاعات پایه
  @Column()
  titleFa: string;

  @Column({ nullable: true })
  titleZh: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ type: 'text', nullable: true })
  descriptionFa: string;

  @Column({ type: 'text', nullable: true })
  descriptionZh: string;

  @Column({ type: 'text', nullable: true })
  descriptionEn: string;

  // قیمت‌گذاری
  @Column('decimal', { precision: 12, scale: 2 })
  basePriceCNY: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basePriceIRR: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basePriceUSD: number;

  // موجودی
  @Column({ default: 0 })
  stockUnit: number;

  // 🆕 فیلدهای جدید کارتن (B2B)
  @Column({ type: 'int', nullable: true })
  unitsPerCarton: number; // تعداد واحد در هر کارتن

  @Column({ type: 'int', nullable: true })
  minOrderCartons: number; // حداقل سفارش بر اساس کارتن

  @Column({ type: 'int', nullable: true })
  minOrderUnits: number; // حداقل سفارش بر اساس واحد

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  cartonWeightKg: number; // وزن هر کارتن (کیلوگرم)

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  cartonVolumeM3: number; // حجم هر کارتن (متر مکعب)

  // وضعیت
  @Column({ 
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  status: ProductStatus;

  // روابط
  @ManyToOne(() => User, user => user.products)
  seller: User;

  // زمان‌ها
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 🆕 متدهای کمکی برای محاسبات کارتن
  calculateCartonQuantity(unitQuantity: number): number {
    if (!this.unitsPerCarton) return 0;
    return Math.ceil(unitQuantity / this.unitsPerCarton);
  }

  validateMinOrder(unitQuantity: number): boolean {
    if (this.minOrderCartons && this.unitsPerCarton) {
      const minUnits = this.minOrderCartons * this.unitsPerCarton;
      return unitQuantity >= minUnits;
    }
    if (this.minOrderUnits) {
      return unitQuantity >= this.minOrderUnits;
    }
    return true;
  }
}
