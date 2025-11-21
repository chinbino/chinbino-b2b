import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  company_name_zh: string;

  @Column({ type: 'varchar', length: 255 })
  company_name_fa: string;

  @Column({ type: 'varchar', length: 100 })
  market_location: string;

  @Column({ type: 'text' })
  booth_numbers: string;

  @Column({ type: 'text', nullable: true })
  contact_info_zh: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  total_orders: number;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];
}
