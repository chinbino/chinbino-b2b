import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameZh: string;

  @Column()
  nameFa: string;

  @Column({ type: 'text', nullable: true })
  descriptionZh: string;

  @Column({ type: 'text', nullable: true })
  descriptionFa: string;

  @Column('decimal', { precision: 10, scale: 2 })
  weightKg: number;

  @Column('decimal', { precision: 10, scale: 3 })
  volumeCbm: number;

  @Column('int')
  itemsPerCarton: number;

  @Column('int', { default: 1 })
  minOrderQty: number;

  @Column('decimal', { precision: 12, scale: 2 })
  priceCny: number;

  @Column('decimal', { precision: 12, scale: 2 })
  pricePerCartonCny: number;

  @Column()
  marketName: string;

  @Column()
  boothNumber: string;

  @Column({ nullable: true })
  supplierCode: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  })
  status: string;

  @ManyToOne(() => User, user => user.id)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
