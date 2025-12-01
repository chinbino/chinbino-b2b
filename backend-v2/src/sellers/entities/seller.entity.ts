import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_zh', type: 'varchar', length: 255 })
  nameZh: string;

  @Column({ name: 'name_fa', type: 'varchar', length: 255, nullable: true })
  nameFa?: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  companyName?: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 255, nullable: true })
  contactPerson?: string;

  @Column({ name: 'phone', type: 'varchar', length: 100, nullable: true })
  phone?: string;

  @Column({ name: 'wechat_id', type: 'varchar', length: 255, nullable: true })
  wechatId?: string;

  @Column({ name: 'aliwangwang_id', type: 'varchar', length: 255, nullable: true })
  aliwangwangId?: string;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ name: 'description_zh', type: 'text', nullable: true })
  descriptionZh?: string;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.seller)
  users: User[];

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
