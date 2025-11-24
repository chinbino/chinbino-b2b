import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ارتباط با سفارش
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  // ارتباط با محصول
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  // اطلاعات سفارش
  @Column('int')
  quantity: number; // تعداد واحد

  @Column('int')
  cartonQuantity: number; // تعداد کارتن

  @Column('decimal', { precision: 12, scale: 2 })
  unitPrice: number; // قیمت واحد

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number; // قیمت کل این آیتم

  // اطلاعات کارتن
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  totalWeight: number; // وزن کل (کیلوگرم)

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  totalVolume: number; // حجم کل (متر مکعب)

  // زمان‌ها
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // محاسبات
  calculateTotals(): void {
    // محاسبه تعداد کارتن
    this.cartonQuantity = Math.ceil(this.quantity / this.product.unitsPerCarton);
    
    // محاسبه قیمت کل
    this.totalPrice = this.unitPrice * this.quantity;
    
    // محاسبه وزن و حجم کل
    if (this.product.cartonWeightKg && this.product.cartonVolumeM3) {
      this.totalWeight = this.cartonQuantity * this.product.cartonWeightKg;
      this.totalVolume = this.cartonQuantity * this.product.cartonVolumeM3;
    }
  }
}
