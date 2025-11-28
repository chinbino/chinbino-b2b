import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status.enum';

@Entity('seller_orders')
export class SellerOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.sellerOrders)
  order: Order;

  @ManyToOne(() => User)
  seller: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotalCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  subtotalIRR: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shippingCostCNY: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  shippingCostIRR: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalIRR: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
