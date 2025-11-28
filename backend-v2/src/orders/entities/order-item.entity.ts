// src/orders/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { SellerOrder } from './seller-order.entity';
import { OrderItemAddon } from './order-item-addon.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => SellerOrder, sellerOrder => sellerOrder.items)
  sellerOrder: SellerOrder;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('int')
  cartonQuantity: number;

  // فیلدهای چندارزی جدید
  @Column('decimal', { precision: 12, scale: 2 })
  unitPriceCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  unitPriceIRR: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPriceCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPriceIRR: number;

  // Add-ons
  @OneToMany(() => OrderItemAddon, addon => addon.orderItem)
  addons: OrderItemAddon[];

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalAddonsCNY: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalAddonsIRR: number;

  // فیلدهای فیزیکی
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  totalWeight: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  totalVolume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
