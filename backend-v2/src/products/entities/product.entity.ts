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

  @Column('decimal', { precision: 12, scale: 2 })
  basePriceCNY: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basePriceIRR: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basePriceUSD: number;

  @Column({ default: 0 })
  stockUnit: number;

  // فیلدهای جدید کارتن
  @Column({ type: 'int', nullable: true })
  unitsPerCarton: number;

  @Column({ type: 'int', nullable: true })
  minOrderCartons: number;

  @Column({ type: 'int', nullable: true })
  minOrderUnits: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  cartonWeightKg: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  cartonVolumeM3: number;

  @Column({ 
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  status: ProductStatus;

  @ManyToOne(() => User, user => user.products)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
