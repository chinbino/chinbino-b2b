import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';
import { OrderStatus, PaymentStatus } from './order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string; // شماره سفارش منحصر بفرد

  // خریدار
  @ManyToOne(() => User, user => user.orders)
  buyer: User;

  // وضعیت‌ها
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  paymentStatus: PaymentStatus;

  // محاسبات مالی
  @Column('decimal', { precision: 12, scale: 2 })
  subtotal: number; // جمع کل بدون مالیات و حمل

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  taxAmount: number; // مالیات

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shippingCost: number; // هزینه حمل

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number; // جمع نهایی

  // اطلاعات حمل و نقل
  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  shippingMethod: string;

  // آیتم‌های سفارش
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  // زمان‌ها
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  // متدهای کمکی
  calculateTotal(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost;
  }
}
