// src/suppliers/entities/supplier.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column({ unique: true })
  businessEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  country: string; // 'iran' یا 'china'

  @Column('text', { nullable: true })
  description: string;

  @Column({ 
    type: 'enum',
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  })
  verificationStatus: string;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  businessLicenseNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ default: true })
  isActive: boolean;

  // رابطه با User
  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  // رابطه با Products
  @OneToMany(() => Product, product => product.supplier)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
