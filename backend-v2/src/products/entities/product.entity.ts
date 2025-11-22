import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  seller: User;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  externalCode: string;

  @Column()
  titleFa: string;

  @Column({ nullable: true })
  titleZh: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ nullable: true })
  descriptionFa: string;

  @Column({ nullable: true })
  descriptionZh: string;

  @Column({ nullable: true })
  descriptionEn: string;

  @Column('decimal', { precision: 12, scale: 2 })
  basePriceCNY: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  basePriceIRR: number;

  @Column({
    type: 'enum',
    enum: ['CNY', 'IRR'],
    default: 'CNY'
  })
  currency: string;

  @Column('int')
  stockUnit: number;

  @Column({ nullable: true })
  mainImageUrl: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'inactive'],
    default: 'draft'
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
