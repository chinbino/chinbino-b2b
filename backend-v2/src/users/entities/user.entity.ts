import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany,
  ManyToOne,
  JoinColumn 
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Seller } from '../../sellers/entities/seller.entity'; // اضافه شد
// import { Order } from '../../orders/entities/order.entity'; // ❌ کامنت کن

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  })
  role: string;

  @Column({
    type: 'enum', 
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  })
  status: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({
    type: 'enum',
    enum: ['fa', 'zh', 'en'],
    default: 'fa'
  })
  preferredLanguage: string;

  @Column({
    type: 'enum',
    enum: ['CNY', 'IRR', 'USD'],
    default: 'IRR'
  })
  preferredCurrency: string;

  // 🔥 رابطه با Seller اضافه شد
  @ManyToOne(() => Seller, (seller) => seller.users, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @Column({ name: 'seller_id', type: 'int', nullable: true })
  sellerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  // @OneToMany(() => Order, order => order.buyer) // ❌ کامنت کن
  // orders: Order[];
}
