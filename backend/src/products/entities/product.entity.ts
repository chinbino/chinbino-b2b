import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // اطلاعات پایه چندزبانه
  @Column({ type: 'varchar', length: 255 })
  name_zh: string;

  @Column({ type: 'varchar', length: 255 })
  name_fa: string;

  @Column({ type: 'text', nullable: true })
  description_zh: string;

  @Column({ type: 'text', nullable: true })
  description_fa: string;

  // مشخصات فنی
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight_kg: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  volume_cbm: number;

  @Column({ type: 'int' })
  items_per_carton: number;

  @Column({ type: 'int', default: 1 })
  min_order_qty: number;

  // قیمت‌گذاری
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price_cny: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price_per_carton_cny: number;

  // اطلاعات فروشنده چینی
  @Column({ type: 'varchar', length: 100 })
  market_name: string;

  @Column({ type: 'varchar', length: 50 })
  booth_number: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supplier_code: string;

  // وضعیت
  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @ManyToOne(() => Seller, seller => seller.products)
  seller: Seller;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // محاسبه قیمت کارتن
  calculateCartonPrice(): void {
    this.price_per_carton_cny = this.price_cny * this.items_per_carton;
  }
}
