import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from '../supplier.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column('int', { default: 1 })
  min_order: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'CASCADE' })
  supplier: Supplier;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

