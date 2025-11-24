import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity'; // اضافه کردن این import

@Entity('users')
export class User {
  // ... فیلدهای موجود

  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  // 🆕 اضافه کردن رابطه orders
  @OneToMany(() => Order, order => order.buyer)
  orders: Order[];

  // ... بقیه فیلدها
}
