// src/products/entities/product.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_zh: string;

  @Column({ nullable: true })
  name_fa: string;

  @Column('text', { nullable: true })
  description_zh: string;

  @Column('text', { nullable: true })
  description_fa: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_cny: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price_irr: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: true })
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @Column({ name: 'seller_id', nullable: true })
  seller_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
