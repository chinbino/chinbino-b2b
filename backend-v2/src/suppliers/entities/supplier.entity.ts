// src/suppliers/entities/supplier.entity.ts
@Entity('suppliers_simple') // ✅ جدول جدید
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column({ unique: true })
  businessEmail: string;

  @Column({ default: 'iran' })
  country: string;

  @Column({ default: 'pending' })
  verificationStatus: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
