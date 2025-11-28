// src/orders/entities/order-item-addon.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum AddonType {
  QUALITY_GUARANTEE = 'quality_guarantee',
  EXTENDED_WARRANTY = 'extended_warranty',
  FAST_SHIPPING = 'fast_shipping',
  CUSTOM = 'custom'
}

export enum CalculationType {
  PERCENT = 'percent',
  FIXED = 'fixed'
}

@Entity('order_item_addons')
export class OrderItemAddon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, orderItem => orderItem.addons, { onDelete: 'CASCADE' })
  orderItem: OrderItem;

  @Column({
    type: 'enum',
    enum: AddonType
  })
  type: AddonType;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: CalculationType
  })
  calculationType: CalculationType;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  valuePercent: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  valueFixedCNY: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  valueFixedIRR: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amountCNY: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amountIRR: number;

  @CreateDateColumn()
  createdAt: Date;
}
