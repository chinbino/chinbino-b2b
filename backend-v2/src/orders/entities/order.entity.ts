// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';
import { OrderStatus, PaymentStatus } from './order-status.enum';
import { SellerOrder } from './seller-order.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => User, user => user.orders)
  buyer: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  // فیلدهای چندارزی جدید
  @Column('decimal', { precision: 12, scale: 2 })
  totalProductsCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalProductsIRR: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalShippingCNY: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalShippingIRR: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalAddonsCNY: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalAddonsIRR: number;

  @Column('decimal', { precision: 12, scale: 2 })
  grandTotalCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  grandTotalIRR: number;

  @Column({ default: 'CNY' })
  baseCurrency: string;

  @Column('decimal', { precision: 10, scale: 4 })
  exchangeRateCNYToIRR: number;

  // فیلدهای موجود
  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  shippingMethod: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  // ارتباط جدید با SellerOrders
  @OneToMany(() => SellerOrder, sellerOrder => sellerOrder.order)
  sellerOrders: SellerOrder[];

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
}
